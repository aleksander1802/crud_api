interface ProdConfiguration {
  mode: 'none' | 'development' | 'production';
}

export const prodConfig: ProdConfiguration = {
  mode: 'production'
};
