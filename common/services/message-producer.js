module.exports = class MessageConsumer {
  constructor(MessagingClient) {
    this._MessagingClient = MessagingClient;
    this._messageInProcess = new Map();
  }

  async addMessage(message, timestamp) {
    await this._MessagingClient.sendMessageToWaitQueue({ timestamp, message });
  }
};
