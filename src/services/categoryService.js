import api from "./api";

export default {

  async getAll() {
    return await api.get("/categories");
  }

};