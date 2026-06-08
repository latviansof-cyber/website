import { createRequire } from 'module'
import path from 'path'
import { withPayload } from '@payloadcms/next/withPayload'

const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Your Next.js config here
  webpack: (webpackConfig: any, { isServer }: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        worker_threads: false,
        assert: require.resolve('assert/'),
        path: require.resolve('path-browserify'),
      }
      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias ?? {}),
        'node:assert': require.resolve('assert/'),
        assert: require.resolve('assert/'),
        path: require.resolve('path-browserify'),
        '@payloadcms/plugin-cloud-storage/utilities': path.resolve(
          process.cwd(),
          'node_modules/@payloadcms/plugin-cloud-storage/dist/utilities/getFileKey.js',
        ),
      }
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
