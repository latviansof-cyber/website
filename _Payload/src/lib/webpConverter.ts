/**
 * Converts an image File or Blob to WebP format in the browser using HTML5 Canvas.
 * Returns the converted WebP File (or original file if already WebP or if conversion fails/not in browser).
 */
export async function convertToWebP(file: File, quality = 0.85): Promise<File> {
  if (typeof window === 'undefined' || file.type === 'image/webp' || !file.type.startsWith('image/')) {
    return file
  }

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || img.width
      canvas.height = img.naturalHeight || img.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return resolve(file)
      }

      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file)
          }
          const baseName = file.name.replace(/\.[^.]+$/, '')
          const webpFile = new File([blob], `${baseName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          })
          resolve(webpFile)
        },
        'image/webp',
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    img.src = url
  })
}
