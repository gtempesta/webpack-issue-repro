const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { WebpackAssetsManifest } = require('webpack-assets-manifest');
const WebpackNotifierPlugin = require('webpack-notifier');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const sources = path.resolve(__dirname, '../resources/');
const output = path.resolve(__dirname, '../public/output/');

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
    // new WebpackAssetsManifest({
    //   // Options go here
    //   output: 'new-asset-manifest.json',
    //   publicPath: '/',
    //   writeToDisk: true, // Optional, if you want the file written to disk
    //   customize(entry, original, manifest, asset) {
    //     // Default behavior — we return the entry unmodified
    //     return entry;
    //   },
    //   done(manifest, stats) {
    //     return new Promise((resolve, reject) => {
    //       try {
    //         const entrypoints = stats.compilation.entrypoints;
    //         const appEntrypoint = entrypoints.get('app');
    //
    //         const files =
    //           appEntrypoint ?
    //             appEntrypoint.getFiles().filter(file => !file.endsWith('.map'))
    //           : [];
    //
    //         const current = manifest.toJSON();
    //         const newManifest = {
    //           files: current,
    //           entrypoints: files,
    //         };
    //
    //         const fs = require('fs');
    //         const path = require('path');
    //         const outputPath = path.resolve(output, manifest.options.output);
    //
    //         fs.writeFileSync(outputPath, JSON.stringify(newManifest, null, 2));
    //
    //         resolve(); // Must resolve to satisfy tapPromise
    //       } catch (err) {
    //         reject(err); // If anything fails
    //       }
    //     });
    //   },
    // }),
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
    }),
    new CleanWebpackPlugin(),
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
  target: 'web',
};

module.exports = config;
