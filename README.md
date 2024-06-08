# chat

This is a monorepo for the chat application. It contains next packages:

`@chat/config` - here must be stored all the project related configurations
`@chat/server` - the server which handles all the requests

## Usage
To run the project, you need to have
1. [Node.js](https://nodejs.org/en/) installed on your machine.
2. [Yarn](https://yarnpkg.com/) installed on your machine. You can also install it using `npm i -g yarn`.

To run the the server check the [server/README.md](./packages/server/README.md) file.


## Technical Notes

1. We use beta express@v5, as it supports async handlers out of the box. This way we can throw errors
from any middleware and they will be caught by the error handler middleware.

2. The module `@electric-sql/pglite`, will allow us to run PostgreSQL's wasm version, which will remove
the need to have a running PostgreSQL server on the machine. The data will be stored in the `data` directory,
when running the server. And it will be stored in-memory when running from tests. This will allow us to run the tests concurrently and each test can change the data without affecting other tests.

3. When using actual `pg` module, the `bigint` numbers will be parsed to string. But in PGlite, they will be
parsed to `number`. So here in jsDocs you will find types as number, but with real `pg` client it will be string.

