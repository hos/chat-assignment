# @chat/server

The package contains `Node.js` server for creating users, rooms and send messages. If you don't have Node.js and
yarn installed, please install them as described in [README.md](../../README.md). There is no need to
have a database connection string, as we will use `@electric-sql/pglite`, to run local PostgreSQL storing
data in the `data` folder.

## Development

For development, the only thing you will need is to run the following command from the root of the project:
```bash
yarn workspace @chat/server run dev
```


## Deployment

To run the server in production mode, you need to run the following command from the root of the project:
```bash
yarn workspace @chat/server run start
```


## Test

This package uses Node.js built-in [assert](https://nodejs.org/docs/v20.13.1/api/assert.html) module and [test runner](https://nodejs.org/docs/v20.13.1/api/test.html#test-runner) for testing. To run the tests, you need to run the following command:
```bash
yarn workspace @chat/server run test
```

Also you can run test in watch mode, using command:
```bash
yarn workspace @chat/server run test --watch
```
