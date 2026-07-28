import { createRequire } from 'module'
import path from 'path'
import { withPayload } from '@payloadcms/next/withPayload'

const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone' as const,
  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    useTypeScriptCli: true,
  },
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Your Next.js config here
  webpack: (webpackConfig: any, { isServer }: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    const vercelOgDir = path.dirname(require.resolve('next/dist/compiled/@vercel/og/package.json'))

    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias ?? {}),
      '@vercel/og': false,
      'next/dist/compiled/@vercel/og': false,
      [path.join(vercelOgDir, 'resvg.wasm')]: false,
      [path.join(vercelOgDir, 'yoga.wasm')]: false,
      [path.join(vercelOgDir, 'Geist-Regular.ttf')]: false,
    }

    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        worker_threads: false,
        assert: require.resolve('assert/'),
        path: require.resolve('path-browserify'),
      }
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
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
