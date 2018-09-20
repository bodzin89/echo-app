const faker = require('faker');
const sinon = require('sinon');
const { assert } = require('chai');

const { MessageConsumer } = require('common/services');

describe('Message Consumer Unit Test', () => {
  let sandbox;
  let messageConsumer;
  let redisClientAddStub;
  let redisClientRemoveStub;

  before(() => {
    sandbox = sinon.createSandbox();
    sandbox.useFakeTimers();

    redisClientAddStub = sandbox.stub();
    redisClientRemoveStub = sandbox.stub();

    messageConsumer = new MessageConsumer({
      add: redisClientAddStub,
      remove: redisClientRemoveStub
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
      redisClientAddStub.resolves();

      await messageConsumer.addMessage(message, timestamp);
    });

    it('should save message into redis', () => {
      assert.ok(redisClientAddStub.calledOnce);
    });

    it('should create timer for message', () => {
      assert.equal(messageConsumer._messageInProcess.size, 1);
    });
  });
});
