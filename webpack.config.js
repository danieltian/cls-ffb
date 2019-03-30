const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { HotModuleReplacementPlugin } = require('webpack')
const { spawn, exec } = require('child_process')

module.exports = (env) => {
  return {
    mode: 'development',
    target: 'electron-renderer',
    entry: path.resolve('src', 'index.js'),
    devtool: 'eval-source-map',

    plugins: [
      new VueLoaderPlugin(),
      new HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve('src', 'index.html')
      })
    ],

    devServer: {
      hot: true, // Enable hot module replacement.
      // Reduce the output from Webpack to just the time taken and build timestamp.
      stats: {
        assets: false,
        hash: false,
        entrypoints: false,
        modules: false
      },

      // This interesting way of starting Electron before webpack-dev-server was taken from:
      // https://blog.alexdevero.com/building-desktop-apps-electron-react/
      before() {
        let child = spawn('electron .', { shell: true, stdio: 'inherit' })
        child.on('error', (error) => console.log(error))
        child.on('close', () => process.exit(0))
      }
    },

    resolve: {
      // Resolve default extensions plus .vue so that these extensions can be omitted when importing files.
      extensions: ['.wasm', '.mjs', '.js', '.json', '.vue']
    },

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        },
        {
          test: /\.styl(us)?$/,
          use: ['vue-style-loader', 'css-loader', 'stylus-loader']
        },
        {
          test: /\.css$/,
          loader: 'css-loader'
        },
        {
          test: /\.(svg|png)$/,
          loader: 'file-loader'
        },
      ]
    }
  }
}
