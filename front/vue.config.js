const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  chainWebpack: (config) => {
    // PDF loader
    config.module
      .rule('pdf')
      .test(/\.(pdf)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .options({ name: 'assets/pdf/[name].[hash:8].[ext]' })

    // Exclude icons folder from default SVG rule
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()

    // SVG sprite loader for icons
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end()
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
})
