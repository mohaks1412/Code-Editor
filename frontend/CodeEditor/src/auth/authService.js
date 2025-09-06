import axios from "axios";

class AuthService {
    API_URL;
  constructor() {
    this.API_URL = `${import.meta.env.VITE_API_URL}/users`;
  }

  async register(userData) {
    
    const res = await axios.post(`${this.API_URL}/register`, userData, { withCredentials: true });
    return res.data;
  }

  async login(userData) {
    const res = await axios.post(`${this.API_URL}/login`, userData, { withCredentials: true });
    if (res.data.token) {
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res.data;
  }

  async logout() {
    // Call the backend's logout endpoint to clear the session cookie
      await axios.post(`${this.API_URL}/logout`, {}, { withCredentials: true });

      // Then, remove the user from local storage on the client side
      localStorage.removeItem("user");
    }
}

export default new AuthService();
