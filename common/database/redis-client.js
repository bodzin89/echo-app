const redis = require('redis');
const { promisify } = require('util');

const config = require('config/redis');

module.exports = class RedisClient {
  constructor() {
    this.client = redis.createClient({
      host: config.host,
      port: config.port
    });
  }

  add(key, value) {
    return promisify(this.client.set)
      .call(this.client, key, value);
  }

  remove(key) {
    return promisify(this.client.del)
      .call(this.client, key);
  }

  find(key) {
    return promisify(this.client.get)
      .call(this.client, key);
  }

  async getAll() {
    const keys = await promisify(this.client.keys)
      .call(this.client, '*');

    const keysWithNumberType = keys.filter(key => Number(key));

    return Promise.all(
      keysWithNumberType.map(async key => {
        const value = await this.find(key);

        return { key, value };
      })
    );
  }

  dropConnection() {
    return promisify(this.client.quit)
      .call(this.client);
  }
};
