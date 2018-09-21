const redis = require('redis');
const { promisify } = require('util');

const config = require('config/redis');

module.exports = class MessagingClient {
  constructor() {
    this.waitQueue = 'echo:wait';
    this.workQueue = 'echo:work';

    this.client = redis.createClient({
      host: config.host,
      port: config.port
    });
  }

  async sendMessageToWaitQueue(message) {
    const isAdded = await promisify(this.client.lpush)
      .call(
        this.client,
        this.waitQueue,
        this._stringifyMessage(message)
      );

    return Boolean(isAdded);
  }

  async checkIfMessageAvailable() {
    const messageAvailable = await promisify(this.client.rpoplpush)
      .call(
        this.client,
        this.waitQueue,
        this.workQueue
      );

    return this._parseMessage(messageAvailable);
  }

  async getMessagesInProgress() {
    const messagesInProgress = await promisify(this.client.lrange)
      .call(
        this.client,
        this.workQueue,
        0,
        -1
      );

    return messagesInProgress.map(this._parseMessage);
  }

  async returnMessageBackToWaitQueue(message) {
    await this.removeMessageFromWorkQueue(message);

    return this.sendMessageToWaitQueue(message);
  }

  async removeMessageFromWorkQueue(message) {
    const isRemoved = await promisify(this.client.lrem)
      .call(
        this.client,
        this.workQueue,
        1,
        this._stringifyMessage(message)
      );

    return isRemoved;
  }

  async purgeQueues() {
    await promisify(this.client.del)
      .call(this.client, this.workQueue);
    await promisify(this.client.del)
      .call(this.client, this.waitQueue);
  }

  dropConnection() {
    return promisify(this.client.quit)
      .call(this.client);
  }

  _stringifyMessage(message) {
    return JSON.stringify(message);
  }

  _parseMessage(message) {
    return JSON.parse(message);
  }
};
