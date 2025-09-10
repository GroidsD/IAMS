import api from "../../../API/axios";
const LocationService = {
  getAllLocations: async () => {
    try {
      const response = await api.get("/api/get-all-location");
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },

  createLocation: async (locationName) => {
    try {
      const response = await api.post("/api/create-new-location", {
        locationName,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  },

  updateLocation: async (locationId, locationName) => {
    try {
      const response = await api.post("/api/update-location", {
        locationId,
        locationName,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  },

  // This is the correct way to make the call
  deleteLocation: async (locationId) => {
    try {
      const response = await api.delete(
        `/api/delete-location?locationId=${locationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  },
};

export default LocationService;
