const { MessageConsumer } = require('common/services');
const { MessagingClient } = require('common/gateway');

const messageConsumer = new MessageConsumer(new MessagingClient());

process.on('unhandledRejection', error => {
  console.error(`Api unhandledRejection error: ${error}`);
  messageConsumer
    .shutdown()
    .then(() => {
      console.log('unhandledRejection: Graceful shutdown.');
      process.exit(1);
    })
    .catch(() => process.exit(1));
});

process.on('uncaughtException', error => {
  console.error(`Api uncaughtException error: ${error}`);
  messageConsumer
    .shutdown()
    .then(() => {
      console.log('uncaughtException: Graceful shutdown.');
      process.exit(1);
    })
    .catch(() => process.exit(1));
});

process.on('SIGINT', () => {
  messageConsumer
    .shutdown()
    .then(() => {
      console.log('SIGINT: Graceful shutdown.');
      process.exit(0);
    })
    .catch(() => process.exit(1));
});

process.on('SIGTERM', () => {
  messageConsumer
    .shutdown()
    .then(() => {
      console.log('SIGTERM: Graceful shutdown.');
      process.exit(0);
    })
    .catch(() => process.exit(1));
});

messageConsumer.listen();
