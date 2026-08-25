import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
  },
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        if (req?.file && req.file.mimetype?.startsWith('image/') && req.file.mimetype !== 'image/webp') {
          try {
            const sharpModule = await import('sharp')
            const sharp = sharpModule.default || sharpModule
            const webpBuffer = await sharp(req.file.data).webp({ quality: 85 }).toBuffer()

            req.file.data = webpBuffer
            req.file.mimetype = 'image/webp'
            req.file.size = webpBuffer.length

            const originalName = req.file.name || 'image'
            const baseName = originalName.replace(/\.[^.]+$/, '')
            const newFilename = `${baseName}.webp`

            req.file.name = newFilename
            data.filename = newFilename
            data.mimeType = 'image/webp'
            data.filesize = webpBuffer.length
          } catch (err) {
            console.warn('[Media Hook] Server WebP conversion skipped or unavailable:', err)
          }
        }
        return data
      },
    ],
  },
}
