const path = require('path')

const isDev =
  process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development'

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

module.exports = withMDX({
  pageExtensions: ['jsx', 'js', 'md', 'mdx'],
  webpack: (config, options) => {
    if (options.isServer) {
      config.externals = ['react', 'theme-ui', ...config.externals]
    }
    config.resolve.alias['react'] = path.resolve(
      __dirname,
      '.',
      'node_modules',
      'react'
    )
    config.resolve.alias['theme-ui'] = path.resolve(
      __dirname,
      '.',
      'node_modules',
      'theme-ui'
    )
    return config
  },
  assetPrefix: isDev ? '' : 'https://compliance-users.staging.carbonplan.org',
})