const Webpack = require('webpack')
const BuildNotifier = require('webpack-build-notifier')
const Autoprefixer = require('autoprefixer')
// const SFDCDeployPlugin = require('webpack-sfdc-deploy-plugin')

module.exports = env_ => {
  if (env_ == null) {
    env_ = {}
  }

  const config = {
    context: `${__dirname}/client/src/${env_.resource_name}`,
    entry: { bundle: ['babel-polyfill', './index.ts'] },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: { presets: [['env', { targets: { browsers: ['ie >= 10', 'last 2 versions'] }, useBuiltIns: true }]] },
            },
            { loader: 'ts-loader', options: { appendTsSuffixTo: [/\.vue$/], silent: true } },
          ],
        },
        { test: /\.vue$/, use: ['vue-loader'] },
        {
          test: /\.css$/, use: [
            'style-loader',
            { loader: 'css-loader', options: { modules: true } },
            { loader: 'postcss-loader', options: { plugins: Autoprefixer({ browsers: ['ie >= 10', 'last 2 versions'] }) } },
          ],
        },
        { test: /(\.woff|\.woff2|\.svg)$/, use: ['url-loader'] },
      ],
    },
    plugins: [
      // new SFDCDeployPlugin({
      //   credentialsPath: `${__dirname}/salesforce.config.js`,
      //   filesFolderPath: `${__dirname}/force-app/main/default/staticresources/${env_.resource_name}`,
      //   staticResourceName: env_.resource_name,
      //   isPublic: true,
      // }),
      new BuildNotifier({
        title: 'sfdx-lds-vue-typescript',
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
  } as any

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
