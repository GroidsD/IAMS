import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import db from "../models/index";

const launchRequirements = async (auditId) => {
  // Kiểm tra nếu đã có requirements
  const existing = await db.Requirement.findAll({ where: { auditId } });
  if (existing.length > 0) return existing;

  // Lấy audit để có checkListFile
  const audit = await db.Audit.findByPk(auditId, {
    include: [{ model: db.CheckList, as: "checkList" }],
  });

  if (!audit || !audit.checkList || !audit.checkList.checkListFile) {
    throw new Error("Checklist file not found for this audit.");
  }

  const filePath = path.join(
    __dirname,
    "../public/uploadsExcel",
    audit.checkList.checkListFile
  );
  if (!fs.existsSync(filePath))
    throw new Error("Checklist file does not exist.");

  // Đọc file Excel
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  // Tạo requirement
  const requirements = await Promise.all(
    rows.map((row) =>
      db.Requirement.create({
        auditId,
        number: row.No,
        question: row.Questions,
        compliancy: null,
        remarks: null,
        evidence: null,
      })
    )
  );

  return requirements;
};

// const updateRequirement = async (requirementId, data) => {
//   const requirement = await db.Requirement.findByPk(requirementId);
//   if (!requirement) throw new Error("Requirement not found.");

//   await requirement.update({
//     compliancy: data.compliancy,
//     remarks: data.remarks,
//     evidence: data.evidence,
//   });

//   return requirement;
// };
const updateRequirement = async (requirementId, data) => {
  const requirement = await db.Requirement.findByPk(requirementId);
  if (!requirement) throw new Error("Requirement not found.");

  // Xóa file cũ nếu cần
  if ((data.file || data.removeEvidence) && requirement.evidence) {
    const oldPath = path.join(__dirname, "..", "public", requirement.evidence);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const evidencePath = data.file
    ? `/uploads/${data.file.filename}`
    : data.removeEvidence
    ? null
    : requirement.evidence;

  await requirement.update({
    compliancy: data.compliancy,
    remarks: data.remarks,
    evidence: evidencePath,
  });

  return requirement;
};

export default {
  launchRequirements: launchRequirements,
  updateRequirement: updateRequirement,
};
