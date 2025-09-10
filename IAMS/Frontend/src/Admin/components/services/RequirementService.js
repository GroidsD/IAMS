import api from "../../../API/axios";

class RequirementService {
  async launchRequirements(auditId) {
    const res = await api.get(`/api/launch-requirements/${auditId}`);
    return res.data;
  }

  async updateRequirement(requirementId, formData) {
    const res = await api.post(
      `/api/update-requirement/${requirementId}`,
      formData
    );
    return res.data;
  }
}

// Gán instance vào biến rồi export
const requirementService = new RequirementService();
export default requirementService;
