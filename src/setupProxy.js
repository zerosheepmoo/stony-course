const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://www.stonybrook.edu/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '' // URL ^/api -> 공백 변경
      }
    })
  );
};
