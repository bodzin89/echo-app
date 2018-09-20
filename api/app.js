const Koa = require('koa');
const bodyParser = require('koa-body');

const { errorHandler } = require('api/middlewares');
const routes = require('api/routes');

const app = new Koa();

app.use(bodyParser());
app.use(errorHandler());

app.use(routes);

module.exports = app;
