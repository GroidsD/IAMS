import db from "../models/index"; // Import your database models

const createNewAudit = async (data) => {
  try {
    const newAudit = await db.Audit.create({
      auditTitle: data.auditTitle,
      locationId: data.locationId,

      areaId: data.areaId,
      typeId: data.typeId,
      shiftId: data.shiftId,
      dateAudit: data.dateAudit,
      auditorId: data.auditorId,
      auditeeId: data.auditeeId,
      checkListId: data.checkListId,
    });

    // Add multiple auditors using the junction model
    if (data.auditorIds && data.auditorIds.length > 0) {
      const auditors = await db.User.findAll({
        where: { userId: data.auditorIds },
      });
      await newAudit.setAuditors(auditors);
    }

    return newAudit;
  } catch (e) {
    throw new Error("Error creating new audit: " + e.message);
  }
};

const getAllAudits = async () => {
  try {
    const audits = await db.Audit.findAll({
      include: [
        { model: db.User, as: "auditee", attributes: ["name", "email"] },
        { model: db.User, as: "auditors", attributes: ["name", "email"] },
        {
          model: db.Area,
          as: "auditArea",
          attributes: ["areaId", "areaName"],
        },
        {
          model: db.Location,
          as: "auditLocation",
          attributes: ["locationId", "locationName"],
        },
        {
          model: db.Type,
          as: "auditType",
          attributes: ["typeId", "typeName"],
        },
        {
          model: db.Shift,
          as: "auditShift",
          attributes: ["shiftId", "shiftName"],
        },
        {
          model: db.Requirement,
          as: "requirements",
          attributes: [
            "auditId",
            "number",
            "question",
            "compliancy",
            "remarks",
            "evidence",
          ],
        },
      ],
      // raw: true,
      // nest: true,
    });
    return audits;
  } catch (e) {
    throw new Error("Error fetching audits: " + e.message);
  }
};

const getAuditById = async (id) => {
  try {
    const audit = await db.Audit.findByPk(id, {
      include: [
        { model: db.User, as: "auditee", attributes: ["name", "email"] },
        { model: db.User, as: "auditors", attributes: ["name", "email"] },
      ],
      raw: true,
      nest: true,
    });
    return audit;
  } catch (e) {
    throw new Error("Error fetching audit: " + e.message);
  }
};

const updateAudit = async (id, data) => {
  try {
    const audit = await db.Audit.findByPk(id);
    if (!audit) {
      throw new Error("Audit not found");
    }

    await audit.update(data);

    // Update multiple auditors
    if (data.auditorIds) {
      const auditors = await db.User.findAll({
        where: { userId: data.auditorIds },
      });
      await audit.setAuditors(auditors);
    }

    return audit;
  } catch (e) {
    throw new Error("Error updating audit: " + e.message);
  }
};

const deleteAudit = async (id) => {
  try {
    const audit = await db.Audit.findByPk(id);
    if (!audit) {
      throw new Error("Audit not found");
    }
    await audit.destroy();
    return true;
  } catch (e) {
    throw new Error("Error deleting audit: " + e.message);
  }
};
const getAuditsByPage = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return await db.Audit.findAndCountAll({
    limit,
    offset,
    include: [
      { model: db.User, as: "auditee", attributes: ["name", "email"] },
      { model: db.User, as: "auditors", attributes: ["name", "email"] },
      { model: db.Area, as: "auditArea", attributes: ["areaId", "areaName"] },
      {
        model: db.Location,
        as: "auditLocation",
        attributes: ["locationId", "locationName"],
      },
      { model: db.Type, as: "auditType", attributes: ["typeId", "typeName"] },
      {
        model: db.Shift,
        as: "auditShift",
        attributes: ["shiftId", "shiftName"],
      },
    ],
  });
};
const getAuditsByAuditeeId = async (auditeeId) => {
  try {
    const audits = await db.Audit.findAll({
      // Lấy tất cả audits có auditeeId trùng với ID của người dùng hiện tại
      where: { auditeeId: auditeeId },
      // Bao gồm các mối quan hệ để hiển thị thông tin đầy đủ
      include: [
        { model: db.User, as: "auditee", attributes: ["name", "email"] },
        { model: db.User, as: "auditors", attributes: ["name", "email"] },
        {
          model: db.Area,
          as: "auditArea",
          attributes: ["areaId", "areaName"],
        },
        {
          model: db.Location,
          as: "auditLocation",
          attributes: ["locationId", "locationName"],
        },
        {
          model: db.Type,
          as: "auditType",
          attributes: ["typeId", "typeName"],
        },
        {
          model: db.Shift,
          as: "auditShift",
          attributes: ["shiftId", "shiftName"],
        },
      ],
      order: [["createdAt", "DESC"]], // Sắp xếp theo ngày tạo mới nhất
    });
    return audits;
  } catch (e) {
    throw new Error("Error fetching audits for auditee: " + e.message);
  }
};
const getAuditReport = async (auditId) => {
  try {
    const audit = await db.Audit.findByPk(auditId, {
      include: [
        {
          model: db.Requirement,
          as: "requirements",
          attributes: [
            "number",
            "question",
            "compliancy",
            "remarks",
            "evidence",
          ],
        },
        {
          model: db.User,
          as: "auditee",
          attributes: ["userId", "name"],
        },
        {
          model: db.User,
          as: "auditors",
          attributes: ["userId", "name"],
        },
        {
          model: db.Area,
          as: "auditArea",
          attributes: ["areaId", "areaName"],
        },
        {
          model: db.Location,
          as: "auditLocation",
          attributes: ["locationId", "locationName"],
        },
        {
          model: db.Type,
          as: "auditType",
          attributes: ["typeId", "typeName"],
        },
        {
          model: db.Shift,
          as: "auditShift",
          attributes: ["shiftId", "shiftName"],
        },
      ],
    });

    if (!audit) {
      return null;
    }

    // Tính toán số lượng "No" và "Not Applicable"
    const noCount = audit.requirements.filter(
      (req) => req.compliancy === "NO"
    ).length;
    const naCount = audit.requirements.filter(
      (req) => req.compliancy === "Not Applicable"
    ).length;

    // Trả về một đối tượng báo cáo hoàn chỉnh
    const report = {
      auditDetails: audit.toJSON(), // Chuyển đổi sang JSON để dễ dàng xử lý
      compliancySummary: {
        noCount,
        naCount,
      },
    };

    return report;
  } catch (e) {
    console.error("Error in getAuditReport service:", e);
    throw new Error("Failed to get audit report.");
  }
};

module.exports = {
  createNewAudit: createNewAudit,
  getAllAudits: getAllAudits,
  getAuditById: getAuditById,
  updateAudit: updateAudit,
  deleteAudit: deleteAudit,
  getAuditsByPage: getAuditsByPage,
  getAuditsByAuditeeId: getAuditsByAuditeeId,
  getAuditReport: getAuditReport,
};
