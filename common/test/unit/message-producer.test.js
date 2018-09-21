const faker = require('faker');
const sinon = require('sinon');
const { assert } = require('chai');

const { MessageProducer } = require('common/services');

describe('Message Producer Unit Test', () => {
  let sandbox;
  let messageProducer;
  let messageClientSendMessageToWaitQueueStub;

  before(() => {
    sandbox = sinon.createSandbox();
    sandbox.useFakeTimers();

    messageClientSendMessageToWaitQueueStub = sandbox.stub();

    messageProducer = new MessageProducer({
      sendMessageToWaitQueue: messageClientSendMessageToWaitQueueStub
    });
  });

  after(() => {
    sandbox.restore();
  });

  context('#addMessage', () => {
    let message;
    let timestamp;

    before(async () => {
      message = faker.random.words(5);
      timestamp = Date.now() + 1000;
      messageClientSendMessageToWaitQueueStub.resolves();

      await messageProducer.addMessage(message, timestamp);
    });

    it('should push message into wait queue', () => {
      assert.ok(messageClientSendMessageToWaitQueueStub.calledOnce);
    });
  });
});
