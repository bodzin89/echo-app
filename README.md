# echo-app

# Development process:

For run microservice, you should follow this steps:

1.  Make sure you have [NodeJS](https://nodejs.org/) and
    [npm](https://www.npmjs.com/) installed.

1.  Make sure you have [Redis](https://redis.io/):

    - To run on MacOS: `brew install redis`
    - To run with Docker: `docker run --name some-redis -d redis` ([more info](https://docs.docker.com/samples/library/redis))
    - Update config file for redis: `vi config/redis.js`

1.  Clone this repo

    ```shell
    git clone git@github.com:bodzin89/echo-app.git
    ```

1.  Install dependencies

    ```shell
    cd echo-app && yarn
    ```

# Run server:

- `yarn api:start` - will start application on port 3000.

# Run test:

- `yarn test:unit` - will run unit tests.
- `yarn test:integration` - will run integration tests with Redis.
- `yarn test:acceptance` - will run acceptance tests. NOTE: server must be started.

### Endpoints:

- URL:
  - `http://localhost:3000/api/v1/echo`
- Method:
  - `POST`
- Data Params:

  - `message` - required field. Text which must be printed to the console. Type `string`.
  - `timestamp` - required field. Timestamp in future, must be greater then now. Type `number`.

    ### Example:

    ```json
    {
      "message": "test message",
      "timestamp": 1537527505918
    }
    ```

- Success Response:

  - Code: 204
  - Response Body:

    Response Body:

        EMPTY

- Error Response:

  - Code: 400 BAD REQUEST

    Response Body:

    ```javascript
    ['Message or timestamp wasnt sent.'];
    ```

  - Code: 409 CONFLICT

    Response Body:

    ```javascript
    ['Timestamp must be greater than now.'];
    ```

  - Code: 500 BAD REQUEST

    Response Body:

    ```javascript
    ['Connection to database lost'];
    ```
