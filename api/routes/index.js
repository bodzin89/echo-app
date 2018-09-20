const Router = require('koa-router');
const routes = require('config/routes');

const { EchoController } = require('../controllers');
const { MessageConsumer } = require('common/services');
const { RedisClient } = require('common/database');

const router = new Router();

const echoController = new EchoController(
  new MessageConsumer(new RedisClient())
);

router.post(routes.echoAtTime, echoController.postHandler.bind(echoController));

module.exports = router.routes();
