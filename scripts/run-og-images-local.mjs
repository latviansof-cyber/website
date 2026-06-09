import { spawnSync } from 'node:child_process'

const forceGeneration = process.env.FORCE_OG_IMAGES === '1'
const isRemoteBuild =
  process.env.CI === '1' ||
  process.env.CI === 'true' ||
  process.env.VERCEL === '1' ||
  process.env.NETLIFY === '1' ||
  process.env.RENDER === 'true' ||
  process.env.RAILWAY_ENVIRONMENT != null ||
  process.env.GITHUB_ACTIONS === 'true' ||
  process.env.CLOUDFLARE_ENV != null

if (isRemoteBuild && !forceGeneration) {
  console.log('Skipping OG image generation on remote/CI build.')
  process.exit(0)
}

console.log('Generating OG images...')
const result = spawnSync('node', ['playwright/generate-og-images.mjs'], {
  stdio: 'inherit',
  shell: false,
})

if (result.error) {
  console.error(`Failed to start OG image generation: ${result.error.message}`)
  process.exit(1)
}

process.exit(result.status ?? 1)
