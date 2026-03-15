import api from "./api";

export default {

   async getListProfessionals() {
    return await api.get("/professionals");
  },

  async getDashboard() {
    return await api.get("/professional/professional/dashboard");
  },

  async saveProfile(data) {
    return await api.post("/professional/profile", data);
  }

};