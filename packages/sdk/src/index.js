export class ChatSDK {
  #token = null;

  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  get headers() {
    return {
      "Content-Type": "application/json",
      Cookie: this.#token ? `token=${this.#token}` : "",
    };
  }

  setToken(token) {
    this.#token = token;
  }

  async createUser(username, password) {
    const response = await fetch(`${this.baseURL}/api/v1/users`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/api/v1/users/current`, {
      method: "GET",
      headers: this.headers,
    });
    return response.json();
  }

  async login(username, password) {
    const response = await fetch(`${this.baseURL}/api/v1/auth/login`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
  }

  async createMessage(content) {
    const response = await fetch(`${this.baseURL}/api/v1/messages`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ content }),
    });
    return response.json();
  }

  async listMessages() {
    const response = await fetch(`${this.baseURL}/api/v1/messages`, {
      method: "GET",
      headers: this.headers,
    });
    return response.json();
  }

  async deleteMessage(messageId) {
    const response = await fetch(
      `${this.baseURL}/api/v1/messages/${messageId}`,
      {
        method: "DELETE",
        headers: this.headers,
      }
    );
    return response.json();
  }
}
