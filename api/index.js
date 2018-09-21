const config = require('config');
const app = require('./app');

require('./boostrap');

app.listen(config.api.port, config.api.host, () => {
  process.stdout.write(
    `The Transcript API has started on port ${config.api.port}.\n`
  );
});
