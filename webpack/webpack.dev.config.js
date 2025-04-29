const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const { ModuleFederationPlugin } = require('webpack').container;
const sources = path.resolve(__dirname, '../resources/');
const output = path.resolve(__dirname, '../public/');

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    app: `${sources}/js/app.js`,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  targets: {
                    browsers: [
                      '> 0.25% and supports es6-module',
                      'not dead',
                      'Firefox ESR',
                    ],
                  },
                  corejs: {
                    // core-js package version
                    // see: https://babeljs.io/docs/babel-preset-env#corejs
                    version: '3.39',
                    proposals: true,
                  },
                },
              ],
            ],
            plugins: [['@babel/plugin-transform-runtime']],
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: '/',
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints['app'].filter(
          fileName => !fileName.endsWith('.map')
        );
        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
    new WebpackNotifierPlugin({
      title: 'Modern JS Webpack',
      excludeWarnings: true,
      alwaysNotify: true,
    }),
    new ModuleFederationPlugin({
      name: 'host',
      library: { type: 'module' },
      filename: 'remoteEntry.js',
      remotes: {
        remote_bucket:
          'https://mda.orion.net/design-area/review/master/assets/remoteEntry.js',
        // remote: 'http://localhost:3001/assets/remoteEntry.js',
      },
    }),
  ],
  output: {
    path: output,
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: '/',
    environment: {
      arrowFunction: true,
      bigIntLiteral: true,
      const: true,
      destructuring: true,
      dynamicImport: true,
      forOf: true,
      module: true,
    },
  },
  target: 'web',
};

module.exports = config;
