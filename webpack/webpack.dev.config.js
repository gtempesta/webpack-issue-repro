const { merge } = require('webpack-merge');
const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const { ModuleFederationPlugin } = require('webpack').container;
const sources = path.resolve(__dirname, '../resources/');
const output = path.resolve(__dirname, '../public/');

const manifestConfiguration = (fileName, entryPointName) => ({
  plugins: [
    new WebpackManifestPlugin({
      fileName: fileName,
      publicPath: '/',
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints[entryPointName].filter(
          fileName => !fileName.endsWith('.map')
        );
        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
  ],
});

const outputConfiguration = folderName => ({
  output: {
    path: output,
    filename: `${folderName}/[name].[contenthash].js`,
    chunkFilename: `${folderName}/[name].[contenthash].js`,
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
});

const microFrontendName = 'micro-frontend';
const microFrontendFolder = 'js-mf';
const microFrontendManifestName = 'asset-manifest-mf.json';

const commonConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'es2020',
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
};

const mainAppConfig = merge([
  commonConfig,
  manifestConfiguration('asset-manifest.json', 'app'),
  outputConfiguration('js'),
  {
    entry: {
      app: `${sources}/js/app.js`,
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
          // remote_bucket: 'https://mda.orion.net/design-area/remoteEntry.js',
          remote: 'http://localhost:3001/assets/remoteEntry.js',
        },
      }),
    ],
  },
]);

const microFrontendConfig = merge([
  commonConfig,
  manifestConfiguration(microFrontendManifestName, microFrontendName),
  outputConfiguration(microFrontendFolder),
  {
    entry: {
      [microFrontendName]: `${sources}/js/micro-frontend.js`,
    },
    experiments: {
      outputModule: true,
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'host',
        library: { type: 'module' },
        filename: 'remoteEntry.js',
        remotes: {
          // remote_bucket: 'https://mda.orion.net/design-area/remoteEntry.js',
          remote: 'http://localhost:3001/assets/remoteEntry.js',
        },
      }),
    ],
  },
]);

// module.exports = [mainAppConfig, microFrontendConfig];

module.exports = mainAppConfig;
