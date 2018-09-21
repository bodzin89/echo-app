const Router = require('koa-router');
const routes = require('config/routes');

const { EchoController } = require('../controllers');
const { MessageProducer } = require('common/services');
const { MessagingClient } = require('common/gateway');

const router = new Router();

const echoController = new EchoController(
  new MessageProducer(new MessagingClient())
);

router.post(routes.echoAtTime, echoController.postHandler.bind(echoController));

module.exports = router.routes();
