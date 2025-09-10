import api from "../../../API/axios";
const shiftService = {
  getAllShifts: async () => {
    try {
      const response = await api.get("/api/get-all-shift");
      return response.data;
    } catch (error) {
      console.error("Error fetching shifts:", error);
      throw error;
    }
  },

  createShift: async (shiftName) => {
    try {
      const response = await api.post("/api/create-new-shift", { shiftName });
      return response.data;
    } catch (error) {
      console.error("Error creating shift:", error);
      throw error;
    }
  },

  updateShift: async (shiftId, shiftName) => {
    try {
      const response = await api.post("/api/update-shift", {
        shiftId,
        shiftName,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating shift:", error);
      throw error;
    }
  },

  // This is the correct way to make the call
  deleteShift: async (shiftId) => {
    try {
      const response = await api.delete(`/api/delete-shift?shiftId=${shiftId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting shift:", error);
      throw error;
    }
  },
};

export default shiftService;
