const axios = require('axios');
const faker = require('faker');
const { assert } = require('chai');

const { routes, acceptance } = require('config');
const acceptanceBaseUrl = `${acceptance.baseUrl}${routes.echoAtTime}`;

describe('Echo At Time API', () => {
  context('when incoming request body valid', () => {
    let response;

    before(async () => {
      const body = {
        message: faker.random.words(5),
        timestamp: Date.now() + 1000
      };

      response = await axios.post(acceptanceBaseUrl, body);
    });

    it('should return 204', () => {
      assert.equal(response.status, 204);
    });
  });

  context('when incoming request body invalid', () => {
    let response;

    it('should throw error', async () => {
      try {
        const body = {
          message: faker.random.words(5)
        };

        await axios.post(acceptanceBaseUrl, body);
        throw new Error('Should throw Error.');
      } catch (error) {
        response = error.response;
      }
    });

    it('should return 400', () => {
      assert.equal(response.status, 400);
    });

    it('should return array of errors', () => {
      assert.isArray(response.data);
    });
  });

  context(
    'when incoming request body has timestamp less than current time',
    () => {
      let response;

      it('should throw error', async () => {
        try {
          const body = {
            message: faker.random.words(5),
            timestamp: Date.now() - 1000
          };

          await axios.post(acceptanceBaseUrl, body);
          throw new Error('Should throw Error.');
        } catch (error) {
          response = error.response;
        }
      });

      it('should return 409', () => {
        assert.equal(response.status, 409);
      });

      it('should return array of errors', () => {
        assert.isArray(response.data);
      });
    }
  );
});
