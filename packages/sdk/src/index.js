export class ChatSDK {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  async createUser(username, password) {
    const response = await fetch(`${this.baseURL}/api/v1/users`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ username, password }),
    });
    const userSession = await response.json();
    if (userSession.session.token) {
      this.headers["Cookie"] = `token=${userSession.session.token}`;
    }
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
    if (data.session.token) {
      this.headers["Cookie"] = `token=${data.session.token}`;
    }
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
