import api from "../../../API/axios";

const UserService = {
  // Lấy tất cả người dùng (dùng cho Admin)
  getAllUsers: async () => {
    try {
      const response = await api.get("/api/get-all-user");
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  // Lấy người dùng theo vai trò (role)
  getUsersByRole: async (role) => {
    try {
      const response = await api.get(`/api/get-users-role?role=${role}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  },
};

export default UserService;
