const faker = require('faker');
const { assert } = require('chai');

const { MessagingClient } = require('common/gateway');

describe('Redis Client Integration Test', () => {
  let messagingClient;

  before(() => {
    messagingClient = new MessagingClient();
  });

  after(async () => {
    await messagingClient.dropConnection();
  });

  context('round-trip test for messaging flow', () => {
    let message;
    let timestamp;
    let result;

    before(() => {
      message = faker.random.words(5);
      timestamp = Date.now() + 1000;
    });

    after(async () => {
      await messagingClient.purgeQueues({
        timestamp,
        message
      });
    });

    it('should add new message into wait queue', async () => {
      const actualResult = await messagingClient.sendMessageToWaitQueue({
        timestamp,
        message
      });

      assert.ok(actualResult);
    });

    it('should return available message from wait queue and move it into work queue', async () => {
      const actualResult = await messagingClient.checkIfMessageAvailable({
        timestamp,
        message
      });

      assert.deepEqual(actualResult, { timestamp, message });
    });

    it('should return messages from work queue', async () => {
      result = await messagingClient.getMessagesInProgress({
        timestamp,
        message
      });

      assert.isArray(result);
    });

    it('should return messages from work queue into wait queue', async () => {
      result = await messagingClient.returnMessageBackToWaitQueue(result.pop());

      assert.ok(result);
    });
  });
});
