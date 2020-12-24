import * as path from 'path'
import webpack, {Configuration} from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'

interface Argv {
  mode: 'development' | 'production'
  env: Env
}

interface Env {}

const config = (env: Env, argv: Argv): Configuration => {
  const devMode = argv.mode === 'development'

  const buildEnvironment = {
    __DEV__: devMode,
  }

  return {
    entry: {
      main: path.join(__dirname, 'src', 'main.tsx'),
    },
    watchOptions: {
      poll: true,
    },
    stats: {
      entrypoints: false,
      colors: true,
      modules: false,
    },
    output: {
      path: path.join(__dirname, 'output-code/'),
      filename: '[name].js',
    },
    target: 'web',
    mode: devMode ? 'development' : 'production',
    devtool: devMode ? 'eval-cheap-module-source-map' : undefined,
    node: false,
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new webpack.DefinePlugin(buildEnvironment),
      // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)()
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              module: 'es6',
            },
          },
        },
      ],
    },
  }
}
module.exports = config
