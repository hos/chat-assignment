# client-cli

This is an interactive CLI client for using the `@chat` service. It supports:

1. Registering a user
2. Logging in
3. Sending messages
4. Receiving messages (pagination not supported, so old messages are not shown)
5. Real-time message reception (using socket.io)
6. Logging out (only local logout, the server doesn't support it)
7. Encrypted store

## Usage

From the root of the project, run the following command:

```bash
yarn workspace @chat/client-cli run start
```

You will be asked for a password, note' this is not the account password, it is the `Store Password`, which is used to encrypt the store.
This of this like pin code on your smartphone, if you have one, if you don't, just don't think about this. The password will be required every
time you run the client, otherwise you will use local state and you will need to login again, so make sure to remember it.

The app will create a `secure.store` file, and store the encrypted data in it.
After that, it will ask for the server URL to be connected to. When running this project locally, the server will run on
`http://localhost:3024` by default and and you just press enter the `client-cli` will use that URL. If you don't have a running server,
you can use default deployed server `https://chat.wyll.in`.

When the app is initialized first time, you will need either login or register. When you register, it will store the `token` inside the store,
so later you don't need to login again, with your username and password. Instead you will use the store password, to unlock the store, the client will recover the token
from the store and use it to authenticate you. In the app you can always use `/h` to see the help, and see the available commands.

For example, you can use `/login` to login, `/reg` to register or `/c` to print current screen and user. After successful login,
you can use `/room` to switch to the room and to send message you need to type the message and press enter.
