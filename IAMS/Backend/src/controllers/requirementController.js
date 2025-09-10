import RequirementService from "../services/RequirementService";
const launchRequirements = async (req, res) => {
  try {
    const { auditId } = req.params;
    const requirements = await RequirementService.launchRequirements(auditId);
    return res.status(200).json({ errCode: 0, data: requirements });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errCode: 1, message: error.message });
  }
};

const updateRequirement = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const { compliancy, remarks, removeEvidence } = req.body;

    let evidencePath = null;
    if (req.file) evidencePath = `/uploads/${req.file.filename}`;
    if (removeEvidence === "true") evidencePath = null;

    const updatedRequirement = await RequirementService.updateRequirement(
      requirementId,
      {
        compliancy,
        remarks,
        evidence: evidencePath,
        file: req.file,
        removeEvidence,
      }
    );

    return res.status(200).json({
      errCode: 0,
      data: {
        ...updatedRequirement.toJSON(),
        remarks: updatedRequirement.remarks || "",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errCode: 1, message: error.message });
  }
};

module.exports = {
  launchRequirements: launchRequirements,
  updateRequirement: updateRequirement,
};
