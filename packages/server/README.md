# @chat/server

The package contains `Node.js` application which provides `REST` API and `WebSocket` server for the chat application. The chat have few features:

1. User registration and authentication.
2. Send messages to a room.
3. Get messages for a specific room.
4. Subscribe to new messages across all the rooms (currently only one room is as specified by assignment).

TODO:

1. Allow to add more rooms.
2. Add endpoint for logout and invalidate the session/token from the database.


## Installation

If you don't have `Node.js` and
yarn installed, please install them as described in [README.md](../../README.md).

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

There is no need to have a database connection string for running the tests, as we will use `@electric-sql/pglite`, to run local, in-memory PostgreSQL database.
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

2. The module `@electric-sql/pglite`, will allow us to run PostgreSQL's wasm version, `in-memory` for the test, which will remove
   the need to have a running PostgreSQL server on the machine. The data will be stored in-memory when running from tests. This will allow us to run the
   tests concurrently and each test can change the data without effecting other test's data. This is first time I'm using
   this module and it's in beta, so I'm not sure how it will behave in production. But it so far it works.

3. Though this project is small, and `int` would be enough for the `id` of the tables, I preferred to use `bigint`,
   as it's more scalable and can be used for bigger projects.

4. When using actual `pg` module, the `bigint` numbers will be parsed to string. But in PGlite, they will be
   parsed to `number`. So here in jsDocs you will find types as string, but inside the tests they will be numbers.

5. The redis is used only by `socket.io` to propagate the events across all servers. So for example
   if you have 3 servers running, and user1, which is connected to server1 send a message to a room
   that server will emit event using `socket.io`, but without redis-adapter it event will be only
   propagated to the users connected to server1. With redis-adapter, the event will be propagated to
   all the servers, that have `socket.io` connected to the same redis instance.
