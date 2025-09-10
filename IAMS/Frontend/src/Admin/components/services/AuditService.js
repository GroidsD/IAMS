import api from "../../../API/axios";

const AuditService = {
  // GET: Lấy tất cả các bản ghi Audit
  getAllAudits: async () => {
    try {
      const response = await api.get("/api/get-all-audits");
      return response.data;
    } catch (error) {
      console.error("Error fetching audits:", error);
      throw error;
    }
  },

  // GET: Lấy một bản ghi Audit theo ID
  getAuditById: async (auditId) => {
    try {
      const response = await api.get(`/api/get-audit/${auditId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching audit with ID ${auditId}:`, error);
      throw error;
    }
  },

  // POST: Tạo một bản ghi Audit mới
  createNewAudit: async (auditData) => {
    try {
      const response = await api.post("/api/create-new-audit", auditData);
      return response.data;
    } catch (error) {
      console.error("Error creating new audit:", error);
      throw error;
    }
  },

  // POST: Cập nhật một bản ghi Audit
  updateAudit: async (auditId, auditData) => {
    try {
      const response = await api.post(
        `/api/update-audit/${auditId}`,
        auditData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating audit with ID ${auditId}:`, error);
      throw error;
    }
  },

  // DELETE: Xóa một bản ghi Audit
  deleteAudit: async (auditId) => {
    try {
      const response = await api.delete(`/api/delete-audit/${auditId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting audit with ID ${auditId}:`, error);
      throw error;
    }
  },
  getAuditsByPage: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/api/get-audits-by-page?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getAuditsForAuditee: async () => {
    try {
      const response = await api.get("/api/get-audits-for-auditee");
      return response.data;
    } catch (error) {
      console.error("Error fetching audits for auditee:", error);
      throw error;
    }
  },
  updateAuditStatus: async (auditId, newStatus) => {
    try {
      const response = await api.post(`/api/update-audit-status/${auditId}`, {
        status: newStatus,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating audit status for ID ${auditId}:`, error);
      throw error;
    }
  },
  // GET: Lấy tất cả các audit mà auditor đang tham gia
  getAuditsByAuditor: async (auditorId) => {
    try {
      const response = await api.get(`/api/audits-by-auditor/${auditorId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching audits for auditor ID ${auditorId}:`,
        error
      );
      throw error;
    }
  },
  // NEW: Lấy báo cáo Audit theo ID
  getAuditReport: async (auditId) => {
    try {
      const response = await api.get(`/api/get-audit-report/${auditId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching audit report for ID ${auditId}:`, error);
      throw error;
    }
  },
};

export default AuditService;
