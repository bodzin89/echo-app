const { BadRequestResponse, ConflictResponse } = require('api/error-responses');

module.exports = class EchoController {
  constructor(messageConsumer) {
    this.messageConsumer = messageConsumer;
    this.messageConsumer.boostrap();
  }

  async postHandler(ctx) {
    const { message, timestamp } = ctx.request.body;

    this._validate(message, timestamp);

    await this.messageConsumer.addMessage(message, timestamp);

    ctx.status = 204;
  }

  _validate(message, timestamp) {
    if (!(message || timestamp)) {
      const messages = 'Message or timestamp wasnt sent.';

      throw new BadRequestResponse(messages);
    }

    if (Date.now() > timestamp) {
      throw new ConflictResponse('Timestamp must be greater than now.');
    }
  }
};
