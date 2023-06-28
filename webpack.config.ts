/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import { Configuration } from 'webpack';
import { devConfig } from './webpack.dev.config';
import { prodConfig } from './webpack.prod.config';

const config: Configuration = {
  target: 'node',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

export const commonConfig = (env: any, argv: Configuration): Configuration => {
  if (argv.mode === 'development') {
    return devConfig;
  }

  if (argv.mode === 'production') {
    return prodConfig;
  }

  return config;
};
