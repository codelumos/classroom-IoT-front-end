module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://172.17.243.32:8080",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
