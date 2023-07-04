import path from 'path';

interface ProdConfiguration {
  mode: 'none' | 'development' | 'production';
  devServer: {
    open: boolean;
    host: 'localhost';
    contentBase: string;
  };
}

export const prodConfig: ProdConfiguration = {
  mode: 'production',
  devServer: {
    open: true,
    host: 'localhost',
    contentBase: path.resolve(__dirname, '../dist'),
  },
};
