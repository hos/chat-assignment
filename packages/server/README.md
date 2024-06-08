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


