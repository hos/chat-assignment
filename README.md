# chat

This is a monorepo for the chat application. It contains next packages:

[@chat/config](./packages/config/README.md) - here must be stored all the project related configurations

[@chat/server](./packages/server/README.md) - the server which handles all the requests

[@chat/sdk](./packages/sdk/README.md) - the javascript sdk for the chat application

[@chat/cli](./packages/client-cli/README.md) - prototype of the client cli for the chat application

## Usage

To run the project, you need to have

1. [Node.js](https://nodejs.org/en/) installed on your machine.
2. [Yarn](https://yarnpkg.com/) installed on your machine. You can also install it using `npm i -g yarn`.
3. Run `yarn install` in the root of the project to install all the dependencies.

You can use the client if you a server, if you want to run your own server, check the [server/README.md](./packages/server/README.md) file.
