const faker = require('faker');
const sinon = require('sinon');
const { assert } = require('chai');

const { MessageConsumer } = require('common/services');

describe('Message Consumer Unit Test', () => {
  let sandbox;
  let messageCosumer;
  let checkIfMessageAvailableStub;

  before(() => {
    sandbox = sinon.createSandbox();
    sandbox.useFakeTimers();

    checkIfMessageAvailableStub = sandbox.stub();

    messageCosumer = new MessageConsumer({
      checkIfMessageAvailable: checkIfMessageAvailableStub
    });
  });

  after(() => {
    sandbox.restore();
  });

  context('#checkNewMessages', () => {
    let originalProcessIncomingMessage;

    before(() => {
      originalProcessIncomingMessage = messageCosumer.processIncomingMessage;
      messageCosumer.processIncomingMessage = sandbox.stub();
    });

    after(() => {
      messageCosumer.processIncomingMessage = originalProcessIncomingMessage;
    });

    context('when messages exists', () => {
      let message;
      let timestamp;

      before(async () => {
        message = faker.random.words(5);
        timestamp = Date.now() + 1000;

        checkIfMessageAvailableStub.resolves({ message, timestamp });

        messageCosumer.processIncomingMessage.returns();

        await messageCosumer.checkNewMessages();
      });

      after(() => {
        sandbox.reset();
      });

      it('should check message', () => {
        assert.ok(checkIfMessageAvailableStub.calledOnce);
      });

      it('should call processIncomingMessage function once', () => {
        assert.ok(messageCosumer.processIncomingMessage.calledOnce);
      });

      it('should call processIncomingMessage with exactly args', () => {
        sinon.assert.calledWithExactly(messageCosumer.processIncomingMessage, {
          message,
          timestamp
        });
      });
    });

    context('when messages not exists', () => {
      before(async () => {
        checkIfMessageAvailableStub.resolves();

        await messageCosumer.checkNewMessages();
      });

      it('should check message', () => {
        assert.ok(checkIfMessageAvailableStub.calledOnce);
      });

      it('should not call processIncomingMessage function', () => {
        assert.ok(messageCosumer.processIncomingMessage.notCalled);
      });
    });
  });

  context('#processIncomingMessage', () => {
    let message;
    let timestamp;
    let originalCreateTimerFunction;

    before(async () => {
      message = faker.random.words(5);
      timestamp = Date.now() + 1000;
      originalCreateTimerFunction = messageCosumer._createTimer;
      messageCosumer._createTimer = sandbox.stub();

      await messageCosumer.processIncomingMessage({ message, timestamp });
    });

    after(() => {
      messageCosumer._createTimer = originalCreateTimerFunction;
    });

    it('should save message into messageInProgress array', () => {
      assert.ok(
        messageCosumer._messageInProcess.indexOf({ message, timestamp })
      );
    });

    it('should create new timer and save it in Map structure', () => {
      assert.strictEqual(messageCosumer._timersInProcess.size, 1);
    });

    it('should call _createTimer once', () => {
      assert.ok(messageCosumer._createTimer.calledOnce);
    });

    it('should call _createTimer with exactly args', () => {
      sinon.assert.calledWithExactly(
        messageCosumer._createTimer,
        timestamp,
        message,
        0
      );
    });
  });
});
