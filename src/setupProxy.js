const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/stony-course/api',
    createProxyMiddleware({
      target: 'https://www.stonybrook.edu/',
      changeOrigin: true,
      pathRewrite: {
        '^/stony-course/api': '' // URL ^/api -> 공백 변경
      }
    })
  );
};
