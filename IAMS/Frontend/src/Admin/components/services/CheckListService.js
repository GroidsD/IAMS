import api from "../../../API/axios";
// Remove the import for CheckList—it's not needed anymore

class CheckListService {
  async getAllCheckLists() {
    try {
      const response = await api.get("/api/get-all-checklist");
      if (response.data.errCode === 0) {
        return response.data; // Return the full response.data (includes errCode, message, data)
      }
      return { errCode: 1, data: [] }; // Fallback for consistency
    } catch (error) {
      console.error("Error while getting Checklist:", error);
      throw error;
    }
  }

  async createCheckList(checkListData) {
    try {
      const response = await api.post(
        "/api/create-new-checklist",
        checkListData
      );
      if (response.data.errCode === 0) {
        return response.data; // Return full response.data
      }
      return null;
    } catch (error) {
      console.error("Error while create Checklist:", error);
      throw error;
    }
  }

  async updateCheckList(updatedData) {
    try {
      const response = await api.post("/api/update-checklist", updatedData);
      // Trả về toàn bộ data từ response để có thể kiểm tra errCode
      return response.data;
    } catch (error) {
      console.error("Error while update Checklist:", error);
      // Quan trọng: Trả về một object lỗi nhất quán
      return { errCode: 1, message: "Failed to update Checklist." };
    }
  }

  async deleteCheckList(checkListId) {
    try {
      const response = await api.delete("/api/delete-checklist", {
        data: { checkListId: checkListId },
      });
      // Trả về toàn bộ response data
      return response.data;
    } catch (error) {
      console.error("Error while delete Checklist:", error);
      // Trả về một object lỗi để frontend xử lý nhất quán
      return { errCode: -1, message: "Network or server error." };
    }
  }
}

const checkListService = new CheckListService();
export default checkListService;
