const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const {
  ModuleFederationPlugin,
} = require('@module-federation/enhanced/webpack');
const sources = path.resolve(__dirname, '../resources/');
const output = path.resolve(__dirname, '../public/output/');

const config = {
  mode: 'development',
  // devtool: 'inline-source-map',
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
            // cacheDirectory: true, // Enable caching for faster rebuilds
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
            // plugins: [['@babel/plugin-transform-runtime']], // this one??
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
    chunkIds: 'deterministic',
    realContentHash: true,
  },
  // cache: false,
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
      runtime: false,
      name: 'host',
      library: { type: 'module' },
      filename: 'remoteEntry.js',
      remotes: {
        // remote_bucket: 'https://mda.orion.net/design-area/remoteEntry.js',
        remote: 'http://localhost:3001/assets/remoteEntry.js',
      },
      // manifest: {
      //   fileName: 'mf-manifest.json',
      // },
    }),
  ],
  output: {
    path: output,
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].js',
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
  target: 'es2020',
};

module.exports = config;
