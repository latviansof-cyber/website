import fs from 'fs'
import path from 'path'

const imagesDir = path.resolve(process.cwd(), 'public/images')

async function optimizeImages() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch (err) {
    console.error('Sharp package not available:', err)
    return
  }

  console.log('Starting image optimization in:', imagesDir)

  // 1. Optimize img1.webp (Hero LCP image)
  const img1Path = path.join(imagesDir, 'img1.webp')
  if (fs.existsSync(img1Path)) {
    const meta = await sharp(img1Path).metadata()
    const origSize = fs.statSync(img1Path).size
    console.log(`Original img1.webp: ${origSize} bytes, dimensions: ${meta.width}x${meta.height}`)
    const buffer = await sharp(img1Path)
      .resize({ width: 1440, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toBuffer()
    fs.writeFileSync(img1Path, buffer)
    console.log(`Optimized img1.webp: ${buffer.length} bytes (saved ${Math.round((1 - buffer.length / origSize) * 100)}%)`)
  }

  // 2. Optimize logo.png
  const logoPath = path.join(imagesDir, 'logo.png')
  if (fs.existsSync(logoPath)) {
    const origSize = fs.statSync(logoPath).size
    console.log(`Original logo.png: ${origSize} bytes`)
    const buffer = await sharp(logoPath)
      .resize({ width: 256, height: 256, fit: 'inside' })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer()
    fs.writeFileSync(logoPath, buffer)
    console.log(`Optimized logo.png: ${buffer.length} bytes (saved ${Math.round((1 - buffer.length / origSize) * 100)}%)`)
  }

  // 3. Optimize remaining large image files in public/images
  const files = fs.readdirSync(imagesDir)
  for (const file of files) {
    if (file === 'img1.webp' || file === 'logo.png') continue
    const filePath = path.join(imagesDir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) continue

    const ext = path.extname(file).toLowerCase()
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue

    const originalSize = stat.size
    if (originalSize > 50 * 1024) { // Only optimize files larger than 50KB
      try {
        let pipeline = sharp(filePath)
        const meta = await pipeline.metadata()
        
        if (meta.width && meta.width > 1600) {
          pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true })
        }

        let buffer
        if (ext === '.webp') {
          buffer = await pipeline.webp({ quality: 80, effort: 5 }).toBuffer()
        } else if (ext === '.png') {
          buffer = await pipeline.png({ compressionLevel: 9, quality: 85 }).toBuffer()
        } else {
          buffer = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer()
        }

        if (buffer.length < originalSize) {
          fs.writeFileSync(filePath, buffer)
          console.log(`Optimized ${file}: ${originalSize} -> ${buffer.length} bytes (${Math.round((1 - buffer.length / originalSize) * 100)}% saved)`)
        }
      } catch (err) {
        console.warn(`Failed to optimize ${file}:`, err.message)
      }
    }
  }

  console.log('Image optimization complete!')
}

optimizeImages().catch(console.error)
