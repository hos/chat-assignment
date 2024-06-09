# @chat/server

The package contains `Node.js` server for creating users, rooms and send messages. If you don't have Node.js and
yarn installed, please install them as described in [README.md](../../README.md). There is no need to
have a database connection string, as we will use `@electric-sql/pglite`, to run local PostgreSQL storing
data in the `data` folder.

## Installation

Beside the Node.js and yarn, that you hopefully installed as described in the root README.md, you need to run redis,
if you want to scale the server. If you already have redis installed, you can use it, but confirm that
the redis connection string in the `server/.env` matches your configuration. If you don't have redis installed,
here is an instruction on how to run it using docker, with our pre-configured docker-compose file:

```bash
# Run this from the project root
docker compose up --wait --timeout 60
```

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

## Technical Notes

1. We use beta express@v5, as it supports async handlers out of the box. This way we can throw errors
   from any middleware and they will be caught by the error handler middleware.

2. The module `@electric-sql/pglite`, will allow us to run PostgreSQL's wasm version, which will remove
   the need to have a running PostgreSQL server on the machine. The data will be stored in the `data` directory,
   when running the server. And it will be stored in-memory when running from tests. This will allow us to run the
   tests concurrently and each test can change the data without effecting other tests. This is first time i'm using
   this module, so i'm not sure how it will behave in production. But it so far it works.

3. When using actual `pg` module, the `bigint` numbers will be parsed to string. But in PGlite, they will be
   parsed to `number`. So here in jsDocs you will find types as number, but with real `pg` client it will be string.
