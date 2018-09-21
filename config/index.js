const routes = require('./routes');
const redis = require('./redis');

module.exports = {
  acceptance: {
    baseUrl: 'http://localhost:3000'
  },
  api: {
    host: 'localhost',
    port: 3000
  },
  routes,
  redis
};
