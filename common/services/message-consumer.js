module.exports = class MessageConsumer {
  constructor(redisClient) {
    this._redisClient = redisClient;
    this._messageInProcess = new Map();
  }

  async addMessage(message, timestamp) {
    await this._redisClient.add(timestamp, message);

    this._messageInProcess.set(
      timestamp,
      this._createTimer(timestamp, message)
    );
  }

  async boostrap() {
    const allMessages = await this._redisClient.getAll();

    allMessages.forEach(({ key, value }) => {
      this._messageInProcess.set(key, this._createTimer(key, value));
    });
  }

  _createTimer(timestamp, message) {
    return setTimeout(async () => {
      process.stdout.write(message + '\n');

      this._messageInProcess.delete(timestamp);

      await this._redisClient.remove(timestamp);
    }, timestamp - Date.now());
  }
};
