import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const TEMP_DIR = path.resolve(process.cwd(), '.tmp-media-opt')
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true })
}

function runWranglerSql(sql) {
  const cleanSql = sql.replace(/"/g, '\\"')
  const output = execSync(
    `npx wrangler d1 execute D1 --command "${cleanSql}" --remote --json`,
    { encoding: 'utf8' }
  )
  const parsed = JSON.parse(output)
  return parsed[0]?.results || []
}

async function optimizeMedia() {
  console.log('Fetching media list from D1...')
  const mediaRows = runWranglerSql('SELECT id, filename, mime_type, filesize, width, height, url FROM media;')
  console.log(`Found ${mediaRows.length} media items in database.`)

  for (const row of mediaRows) {
    const { id, filename, mime_type, filesize } = row
    if (!filename) continue

    console.log(`\n----------------------------------------`)
    console.log(`Processing [#${id}] ${filename} (mime: ${mime_type}, size: ${(filesize / 1024).toFixed(1)} KB)`)

    const localOriginalPath = path.join(TEMP_DIR, `orig_${id}_${filename}`)
    const baseName = filename.replace(/\.[^.]+$/, '')
    const newFilename = `${baseName}.webp`
    const localOptimizedPath = path.join(TEMP_DIR, newFilename)

    // Step 1: Download original from R2
    try {
      execSync(
        `npx wrangler r2 object get "latviansof-media/${filename}" --file="${localOriginalPath}" --remote`,
        { stdio: 'inherit' }
      )
    } catch (e) {
      console.error(`Failed to download ${filename} from R2:`, e.message)
      continue
    }

    if (!fs.existsSync(localOriginalPath)) {
      console.warn(`File ${localOriginalPath} does not exist after download.`)
      continue
    }

    // Step 2: Convert to WebP & resize with sharp
    let metadata
    try {
      const image = sharp(localOriginalPath)
      metadata = await image.metadata()

      let pipeline = image.rotate() // Auto-orient EXIF
      if (metadata.width && metadata.width > 1600) {
        pipeline = pipeline.resize({ width: 1600, fit: 'inside', withoutEnlargement: true })
      }
      pipeline = pipeline.webp({ quality: 80 })

      await pipeline.toFile(localOptimizedPath)
    } catch (e) {
      console.error(`Sharp failed to process ${filename}:`, e.message)
      continue
    }

    const newStats = fs.statSync(localOptimizedPath)
    const newMeta = await sharp(localOptimizedPath).metadata()
    const savingsPercent = (((filesize - newStats.size) / filesize) * 100).toFixed(1)

    console.log(`Optimized ${filename} -> ${newFilename}`)
    console.log(`Size: ${(filesize / 1024).toFixed(1)} KB -> ${(newStats.size / 1024).toFixed(1)} KB (${savingsPercent}% saved!)`)
    console.log(`Dimensions: ${metadata.width}x${metadata.height} -> ${newMeta.width}x${newMeta.height}`)

    // Step 3: Upload WebP to R2
    try {
      execSync(
        `npx wrangler r2 object put "latviansof-media/${newFilename}" --file="${localOptimizedPath}" --remote`,
        { stdio: 'inherit' }
      )
    } catch (e) {
      console.error(`Failed to upload ${newFilename} to R2:`, e.message)
      continue
    }

    // Update D1 media record
    const newUrl = `/api/media/file/${encodeURIComponent(newFilename)}`
    const sqlUpdate = `UPDATE media SET filename = '${newFilename}', mime_type = 'image/webp', filesize = ${newStats.size}, width = ${newMeta.width}, height = ${newMeta.height}, url = '${newUrl}' WHERE id = ${id};`
    runWranglerSql(sqlUpdate)
    console.log(`Updated D1 record #${id} -> filename: ${newFilename}`)
  }

  console.log('\n========================================')
  console.log('R2 Media optimization completed successfully!')
}

optimizeMedia().catch((e) => {
  console.error(e)
  process.exit(1)
})
