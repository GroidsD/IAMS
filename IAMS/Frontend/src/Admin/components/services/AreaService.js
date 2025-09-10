import api from "../../../API/axios";
const AreaService = {
  getAllAreas: async () => {
    try {
      const response = await api.get("/api/get-all-area");
      return response.data;
    } catch (error) {
      console.error("Error fetching areas:", error);
      throw error;
    }
  },

  createArea: async (areaName) => {
    try {
      const response = await api.post("/api/create-new-area", { areaName });
      return response.data;
    } catch (error) {
      console.error("Error creating area:", error);
      throw error;
    }
  },

  updateArea: async (areaId, areaName) => {
    try {
      const response = await api.post("/api/update-area", { areaId, areaName });
      return response.data;
    } catch (error) {
      console.error("Error updating area:", error);
      throw error;
    }
  },

  // This is the correct way to make the call
  deleteArea: async (areaId) => {
    try {
      const response = await api.delete(`/api/delete-area?areaId=${areaId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting area:", error);
      throw error;
    }
  },
};

export default AreaService;
