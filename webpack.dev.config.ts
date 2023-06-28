import path from 'path';

interface DevConfiguration {
  mode: 'none' | 'development' | 'production';
  devtool: string;
  devServer: {
    contentBase: string;
  };
  watch: boolean;
}

export const devConfig: DevConfiguration = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist')
  },
  watch: true
};
