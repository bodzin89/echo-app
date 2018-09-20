const sinon = require('sinon');
const faker = require('faker');
const { assert } = require('chai');

const { EchoController } = require('api/controllers');

describe('EchoController Unit Test', () => {
  let sandbox;
  let originalValidateMethod;
  let messageConsumerAddMessageStub;
  let echoController;

  before(() => {
    sandbox = sinon.createSandbox();
    originalValidateMethod = EchoController._validate;
    messageConsumerAddMessageStub = sandbox.stub();

    echoController = new EchoController({
      addMessage: messageConsumerAddMessageStub
    });

    echoController._validate = sandbox.spy(echoController._validate);
  });

  after(() => {
    echoController._validate = originalValidateMethod;

    sandbox.restore();
  });

  context('when message and timestamp exist', () => {
    let message;
    let timestamp;

    before(async () => {
      message = faker.random.words(5);
      timestamp = Date.now() + 1000;

      const request = { body: { message, timestamp } };

      messageConsumerAddMessageStub.resolves();

      await echoController.postHandler({ request });
    });

    after(() => {
      sandbox.reset();
    });

    it('should call echoController._validate once', () => {
      assert.ok(echoController._validate.calledOnce);
    });

    it('should call echoController._validate with exactly arguments', () => {
      sinon.assert.calledWithExactly(
        echoController._validate,
        message,
        timestamp
      );
    });

    it('should call MessageConsumer.addMessage once', () => {
      assert.ok(messageConsumerAddMessageStub.calledOnce);
    });
  });

  context('when message and timestamp doesnt exist', () => {
    after(() => {
      sandbox.reset();
    });

    it('should throw BadRequestResponse', async () => {
      try {
        const request = { body: {} };

        messageConsumerAddMessageStub.resolves();

        await echoController.postHandler({ request });
      } catch (error) {
        assert.equal(error.status, 400);
      }
    });

    it('should call echoController._validate once', () => {
      assert.ok(echoController._validate.calledOnce);
    });

    it('should call echoController._validate with exactly arguments', () => {
      sinon.assert.calledWithExactly(
        echoController._validate,
        undefined,
        undefined
      );
    });

    it('should not call MessageConsumer.addMessage', () => {
      assert.isFalse(messageConsumerAddMessageStub.calledOnce);
    });
  });

  context('when timestamp is greater than ', () => {
    let message;
    let timestamp;

    after(() => {
      sandbox.reset();
    });

    it('should throw ConflictResponse', async () => {
      try {
        message = faker.random.words(5);
        timestamp = Date.now() - 1000;

        const request = { body: { message, timestamp } };

        messageConsumerAddMessageStub.resolves();

        await echoController.postHandler({ request });

        throw new Error('Test must fail!');
      } catch (error) {
        assert.equal(error.status, 409);
      }
    });

    it('should call echoController._validate once', () => {
      assert.ok(echoController._validate.calledOnce);
    });

    it('should call echoController._validate with exactly arguments', () => {
      sinon.assert.calledWithExactly(
        echoController._validate,
        message,
        timestamp
      );
    });

    it('should not call MessageConsumer.addMessage', () => {
      assert.isFalse(messageConsumerAddMessageStub.calledOnce);
    });
  });
});
