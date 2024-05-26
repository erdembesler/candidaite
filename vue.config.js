module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "~vuetify/styles/main.sass"`
      },
      scss: {
        additionalData: `@import "~vuetify/styles/main.sass";`
      }
    }
  }
}
