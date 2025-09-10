import db from "../models/index.js";
import { Op } from "sequelize";

import AuditService from "../services/AuditService";

const handleCreateNewAudit = async (req, res) => {
  try {
    const auditData = req.body;
    const newAudit = await AuditService.createNewAudit(auditData);
    return res.status(200).json({
      errCode: 0,
      message: "Audit created successfully",
      data: newAudit,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      message: "Failed to create audit",
    });
  }
};

const handleGetAllAudits = async (req, res) => {
  try {
    const audits = await AuditService.getAllAudits();
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: audits,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      message: "Failed to get audits",
    });
  }
};

const handleGetAuditById = async (req, res) => {
  try {
    const auditId = req.params.id;
    if (!auditId) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing audit ID",
      });
    }
    const audit = await AuditService.getAuditById(auditId);
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: audit,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      message: "Failed to get audit",
    });
  }
};

const handleUpdateAudit = async (req, res) => {
  try {
    const auditId = req.params.id;
    const auditData = req.body;
    if (!auditId) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing audit ID",
      });
    }
    const updatedAudit = await AuditService.updateAudit(auditId, auditData);
    return res.status(200).json({
      errCode: 0,
      message: "Audit updated successfully",
      data: updatedAudit,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      message: "Failed to update audit",
    });
  }
};

const handleDeleteAudit = async (req, res) => {
  try {
    const auditId = req.params.id;
    if (!auditId) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing audit ID",
      });
    }
    await AuditService.deleteAudit(auditId);
    return res.status(200).json({
      errCode: 0,
      message: "Audit deleted successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      message: "Failed to delete audit",
    });
  }
};
const handleGetAuditsByPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { rows: audits, count: totalItems } =
      await AuditService.getAuditsByPage(page, limit);

    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: audits,
      totalItems,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      message: "Failed to get audits",
    });
  }
};
// Thêm hàm này vào auditController.js

const handleGetAuditsByAuditeeId = async (req, res) => {
  try {
    // Lấy auditeeId từ req.user đã được thêm vào bởi middleware
    const auditeeId = req.user.userId;

    if (!auditeeId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "User ID not found.",
      });
    }

    const audits = await AuditService.getAuditsByAuditeeId(auditeeId);
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      audits: audits,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server at audit controller.",
    });
  }
};
const handleUpdateAuditStatus = async (req, res) => {
  try {
    const auditId = req.params.id;
    const { status } = req.body;
    // console.log("Received status:", status);

    // Kiểm tra xem trạng thái mới có hợp lệ không
    if (
      !status ||
      !["Confirmed", "Reschedule", "Canceled", "Planned"].includes(status)
    ) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Invalid status provided.",
      });
    }

    const updatedAudit = await AuditService.updateAudit(auditId, { status });
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      data: updatedAudit,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server at audit controller.",
    });
  }
};
// AuditController.js
const handleGetAuditsByAuditor = async (req, res) => {
  try {
    const { auditorId } = req.params;

    const audits = await db.Audit.findAll({
      include: [
        {
          model: db.User,
          as: "auditors",
          where: { userId: auditorId },
          attributes: ["userId", "name", "email"], // sửa từ "id" → "userId"
          required: true, // đảm bảo join đúng
        },
        {
          model: db.User,
          as: "auditee",
          attributes: ["userId", "name", "email"],
        },
        { model: db.Area, as: "auditArea" },
        { model: db.Location, as: "auditLocation" },
        { model: db.Type, as: "auditType" },
        { model: db.Shift, as: "auditShift" },
      ],
      where: {
        "$auditors.userId$": auditorId,
      },
      distinct: true,
    });

    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: audits,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errCode: 1, message: "Server error" });
  }
};
const handleGetAuditReport = async (req, res) => {
  try {
    const auditId = req.params.id;
    // console.log(auditId);

    if (!auditId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing audit ID.",
      });
    }

    const report = await AuditService.getAuditReport(auditId);

    if (!report) {
      return res.status(404).json({
        errCode: 2,
        errMessage: "Audit report not found.",
      });
    }

    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      data: report,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server at audit controller.",
    });
  }
};

module.exports = {
  handleCreateNewAudit: handleCreateNewAudit,
  handleGetAllAudits: handleGetAllAudits,
  handleGetAuditById: handleGetAuditById,
  handleUpdateAudit: handleUpdateAudit,
  handleDeleteAudit: handleDeleteAudit,
  handleGetAuditsByPage: handleGetAuditsByPage,
  handleGetAuditsByAuditeeId: handleGetAuditsByAuditeeId,
  handleUpdateAuditStatus: handleUpdateAuditStatus,
  handleGetAuditsByAuditor: handleGetAuditsByAuditor,
  handleGetAuditReport: handleGetAuditReport,
};
