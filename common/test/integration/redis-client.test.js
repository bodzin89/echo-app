const faker = require('faker');
const { assert } = require('chai');

const { RedisClient } = require('common/database');

describe('Redis Client Integration Test', () => {
  let redisClient;

  before(() => {
    redisClient = new RedisClient();
  });

  after(async () => {
    await redisClient.dropConnection();
  });

  context('round-trip test including add, find, remove', () => {
    let message;
    let timestamp;
    let result;

    before(async () => {
      message = faker.random.words(5);
      timestamp = Date.now() + 1000;

      await redisClient.add(timestamp, message);
    });

    after(async () => {
      await redisClient.remove(timestamp);
    });

    it('should create new entry', async () => {
      result = await redisClient.find(timestamp);

      assert.deepEqual(result, message);
    });
  });

  context('#getAll', () => {
    let allMessages;
    let result;

    before(async () => {
      allMessages = Array.from({ length: 10 }, () => ({
        key: Date.now() + faker.random.number(),
        value: faker.random.words(5)
      }));

      await Promise.all(
        allMessages.map(({ key, value }) => redisClient.add(key, value))
      );

      result = await redisClient.getAll();
    });

    after(async () => {
      await Promise.all(allMessages.map(({ key }) => redisClient.remove(key)));
    });

    it('should return all entries', () => {
      assert.strictEqual(result.length, allMessages.length);
    });
  });
});
