module.exports = class MessageConsumer {
  constructor(messagingClient) {
    this._messagingClient = messagingClient;
    this._messageInProcess = [];
    this._timersInProcess = new Map();
    this._isAlive = true;
  }

  async listen() {
    while (this._isAlive) {
      this.checkNewMessages();

      await this._sleep();
    }
  }

  async checkNewMessages() {
    const messageBody = await this._messagingClient.checkIfMessageAvailable();

    if (messageBody) {
      this.processIncomingMessage(messageBody);
    }
  }

  processIncomingMessage(messageBody) {
    const { message, timestamp } = messageBody;

    const length = this._messageInProcess.push(messageBody);

    const messageIndex = length - 1;

    this._timersInProcess.set(
      timestamp,
      this._createTimer(timestamp, message, messageIndex)
    );
  }

  returnMessagesBack() {
    this._stopTimers();

    return Promise.all(
      this._messageInProcess.map(message =>
        this._messagingClient.returnMessageBackToWaitQueue(message)
      )
    );
  }

  _stopTimers() {
    this._timersInProcess.forEach(timer => clearTimeout(timer));
  }

  shutdown() {
    this._isAlive = false;

    return this.returnMessagesBack();
  }

  _createTimer(timestamp, message, elementToRemove) {
    return setTimeout(async () => {
      process.stdout.write(`${message}. ${new Date(timestamp)} \n`);

      this._messageInProcess.splice(elementToRemove, 1);

      await this._messagingClient.removeMessageFromWorkQueue({
        timestamp,
        message
      });
    }, timestamp - Date.now());
  }

  _sleep() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};
