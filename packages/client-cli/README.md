# client-cli

This is an interactive cli client to use the `@chat` service. It supports

1. registering a user
2. logging in
3. sending messages
4. receiving messages (currently don't support pagination, so old messages are not shown)
5. receiving in real-time (using socket.io)
6. logging out
7. encrypted store

## Usage

From the root of the project, run the following commands:

```bash
yarn workspace @chat/client-cli run start
```


You will be asked for a password, which will be used to encrypt the store. This password will be required every time you run the client,
so make sure to remember it. Then it will create a `secure.store` file, and store the encrypted data in it. After that, it will ask for the server
to be connected to. The server in this project by default runs on `http://localhost:3024`, if you are running it locally, you can just press enter.
To choose other server, type your servers url and then the client will start.

First you will need either login or register. When you register, it will store the `token` inside the store, so later you don't need to login again,
with your username and password. Instead you will use the store password, to unlock the store, the client will recover the token
from the store and use it to authenticate you. Then, you can use `/room` to switch to room screen, at this moment there is only one room
supported, but it can be easily extended to support multiple rooms. In the room, just type the message and press enter to send it.
