const { BadRequestResponse, ConflictResponse } = require('api/error-responses');

module.exports = class EchoController {
  constructor(messageConsumer) {
    this.messageConsumer = messageConsumer;
  }

  async postHandler(ctx) {
    const { message, timestamp } = ctx.request.body;

    this._validate(message, timestamp);

    await this.messageConsumer.addMessage(message, timestamp);

    ctx.status = 204;
  }

  _validate(message, timestamp) {
    if (!message || !timestamp) {
      throw new BadRequestResponse('Message or timestamp wasnt sent.');
    }

    if (Date.now() > timestamp) {
      throw new ConflictResponse('Timestamp must be greater than now.');
    }
  }
};
