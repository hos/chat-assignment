# sdk

This is a JavaScript SDK for the `@chat` service API.

## Usage

```ts
const sdk = new ChatSDK("http://localhost:3024");

// Example calls
(async () => {
  // Create a user
  const user = await sdk.createUser("jamesbond", "StrongIndependentPassword");

  // Login
  const loginData = await sdk.login("jamesbond", "StrongIndependentPassword");

  // Get current user
  const currentUser = await sdk.getCurrentUser();

  // Create a message
  const message = await sdk.createMessage("Hello, World!");

  // List messages
  const messages = await sdk.listMessages();

  // Delete a message
  const deleteResponse = await sdk.deleteMessage(1);
})();
```
