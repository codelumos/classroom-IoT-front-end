module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://172.31.50.73:8080",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
