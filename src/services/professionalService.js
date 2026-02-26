import api from "./api";

export default {

  async getDashboard() {
    return await api.get("/professional/professional/dashboard");
  },

  async saveProfile(data) {
    return await api.post("/professional/profile", data);
  }

};