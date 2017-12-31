const Webpack = require('webpack')
const BuildNotifier = require('webpack-build-notifier')
const SfdcDeployPlugin = require('webpack-sfdc-deploy-plugin')

module.exports = env_ => {
  if (env_ == null) {
    env_ = {}
  }

  const config: any = {
    context: `${__dirname}/client/src/${env_.resource_name}`,
    entry: { bundle: ['babel-polyfill', 'whatwg-fetch', './index.ts'] },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: { presets: [['env', { targets: { browsers: ['last 2 versions', 'android >= 4.4', 'ie >= 11'] } }]] },
            },
            { loader: 'ts-loader', options: { appendTsSuffixTo: [/\.vue$/], silent: true } },
          ],
        },
        { test: /\.vue$/, use: ['vue-loader'] },
        { test: /\.css$/, use: ['style-loader', { loader: 'css-loader', options: { modules: true } }] },
        { test: /(\.woff|\.woff2|\.svg)$/, use: ['url-loader'] },
      ],
    },
    plugins: [
      new Webpack.ProvidePlugin({ URLSearchParams: 'url-search-params', FormData: 'form-data' }),
      // new SfdcDeployPlugin({
      //   credentialsPath: `${__dirname}/salesforce.config.js`,
      //   filesFolderPath: `${__dirname}/force-app/main/default/staticresources/${env_.resource_name}`,
      //   staticResourceName: env_.resource_name,
      //   isPublic: true,
      // }),
      new BuildNotifier({
        title: 'sfdc-olympic',
        successSound: false,
        suppressCompileStart: false,
        onClick: () => null,
      }),
    ],
    output: {
      path: `${__dirname}/force-app/main/default/staticresources/${env_.resource_name}`,
      filename: '[name].js',
      sourceMapFilename: '[file].map',
      libraryTarget: 'umd',
      library: env_.resource_name,
    },
    resolve: { extensions: ['.ts', '.js'], alias: { vue: 'vue/dist/vue.js' } },
  }

  if (env_.production) {
    config.plugins.push(new Webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }))
    config.plugins.push(new Webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }))
    config.plugins.push(new Webpack.optimize.OccurrenceOrderPlugin())
    config.plugins.push(new Webpack.optimize.AggressiveMergingPlugin())
  } else {
    config.devtool = 'source-map'
  }

  return config
}
