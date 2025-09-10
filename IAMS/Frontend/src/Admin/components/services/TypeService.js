import api from "../../../API/axios";
const TypeService = {
  getAllTypes: async () => {
    try {
      const response = await api.get("/api/get-all-type");
      return response.data;
    } catch (error) {
      console.error("Error fetching Types:", error);
      throw error;
    }
  },

  createType: async (typeName) => {
    try {
      const response = await api.post("/api/create-new-type", { typeName });
      return response.data;
    } catch (error) {
      console.error("Error creating Type:", error);
      throw error;
    }
  },

  updateType: async (typeId, typeName) => {
    try {
      const response = await api.post("/api/update-type", { typeId, typeName });
      return response.data;
    } catch (error) {
      console.error("Error updating Type:", error);
      throw error;
    }
  },

  // This is the correct way to make the call
  deleteType: async (typeId) => {
    try {
      const response = await api.delete(`/api/delete-type?typeId=${typeId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Type:", error);
      throw error;
    }
  },
};

export default TypeService;
