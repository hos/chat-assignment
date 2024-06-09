# sdk

This is a JavaScript SDK for the `@chat` service API.

## Usage

```ts
const sdk = new ChatSDK("http://localhost:3024");

// Example calls
(async () => {
  // Create a user
  const user = await sdk.createUser("jamesbond", "StrongIndependentPassword");
  console.log(user);

  // Login
  const loginData = await sdk.login("jamesbond", "StrongIndependentPassword");
  console.log(loginData);

  // Get current user
  const currentUser = await sdk.getCurrentUser();
  console.log(currentUser);

  // Create a message
  const message = await sdk.createMessage("Hello, World!");
  console.log(message);

  // List messages
  const messages = await sdk.listMessages();
  console.log(messages);

  // Delete a message
  const deleteResponse = await sdk.deleteMessage(1);
  console.log(deleteResponse);
})();
```
