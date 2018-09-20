const config = require('config');
const app = require('./app');

process.on('unhandledRejection', error => {
  console.error(`Api unhandledRejection error: ${error}`);
});

process.on('uncaughtException', error => {
  console.error(`Api uncaughtException error: ${error}`);
});

app.listen(config.api.port, config.api.host, () => {
  process.stdout.write(
    `The Transcript API has started on port ${config.api.port}.\n`
  );
});
