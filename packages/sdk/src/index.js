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

  safeJsonParse(response) {
    if (response.status >= 500) {
      throw new Error(
        `Invalid server response: ${response.status}, ${response.statusText}`
      );
    }
    return response.json();
  }

  fetch(url, options) {
    return fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: this.headers,
    }).then(this.safeJsonParse);
  }

  async healthCheck() {
    return this.fetch(`/health`);
  }

  async createUser(username, password) {
    return this.fetch(`/api/v1/users`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async getCurrentUser() {
    return this.fetch(`/api/v1/users/current`, {
      method: "GET",
    });
  }

  async login(username, password) {
    return this.fetch(`/api/v1/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async createMessage(content) {
    return this.fetch(`/api/v1/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  async listMessages() {
    return this.fetch(`/api/v1/messages`, {
      method: "GET",
    });
  }

  async deleteMessage(messageId) {
    return this.fetch(`${this.baseURL}/api/v1/messages/${messageId}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }
}
