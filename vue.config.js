const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: "",
      //process.env.NODE_ENV === "production" ? "/uploads/avatar" : "/server/uploads/avatar",
  // publicPath:
  //     process.env.NODE_ENV === "production" ? "/" : "/",
  transpileDependencies: true,


  devServer: {
    historyApiFallback: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true
      },

    }
  }
})

