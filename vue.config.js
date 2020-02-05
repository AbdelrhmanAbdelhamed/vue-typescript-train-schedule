module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/scss/variables.scss";`
      }
    }
  },
  productionSourceMap: false,
  assetsDir: "assets",
  transpileDependencies: ["vuetify"]
};
