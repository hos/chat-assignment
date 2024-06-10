# Chat

This is a monorepo for the chat application. The project provides end to end chat application solution.

It contains next packages:

[@chat/config](./packages/config/README.md) - Project specific configurations, which can be used from other packages.

[@chat/server](./packages/server/README.md) - Node.js server ro run REST API and socket.io for the chat application.

[@chat/sdk](./packages/sdk/README.md) - The JavaScript SDK, wrapper around the REST API of the chat application.

[@chat/cli](./packages/client-cli/README.md) - prototype of the client cli for the chat application

To run the server, you will need an postgres and redis databases. If you don't have them, this project have docker-compose file to run them.

## Requirements

To run the project, you need to have

1. [Node.js](https://nodejs.org/en/) installed on your machine.
2. [Yarn](https://yarnpkg.com/) installed on your machine. You can also install it using `npm i -g yarn`.
3. [Docker](https://www.docker.com/) installed on your machine or you can use your own postgres and redis databases,
   but ensure that you pass them through the environment variables `DATABASE_URL` and `REDIS_URL`.

## Installation

To install the project, you need to run the following commands:

```bash
yarn install
```

## Running the project

If you have an running server URL, you can skip the part for running your own server. But if you want anyway to run your own server, you can check the [server/README.md](./packages/server/README.md) file.

After running the server, you can use the `client-cli` to use the chat application. You can check the [client-cli/README.md](./packages/client-cli/README.md) file for running the it.

## Testing

This project have configured Github Action to run the tests on every push and pull request to the `main` branch. If you want to run the tests locally, you can run the following command:

```bash
yarn test
```

Or if you want to watch the tests, you can run the following command:

```bash
yarn test:watch
```

Beside this tests, you can run test for each package separately. You can check the README.md file of each package for more information.
