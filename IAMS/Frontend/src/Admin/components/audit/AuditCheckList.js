import React, { useState } from "react";
import RequirementService from "../services/RequirementService";
import Swal from "sweetalert2";

const compliancyOptions = ["YES", "NO", "Not Applicable"];

const AuditChecklist = ({
  requirements,
  setRequirements,
  handleBackToAudits,
  userRole,
}) => {
  const [previewImage, setPreviewImage] = useState(null);

  // Check if all requirements have a compliancy value. This determines if the checklist has been submitted.
  const isChecklistSubmitted = requirements.every(
    (req) =>
      req.compliancy !== null &&
      req.compliancy !== undefined &&
      req.compliancy !== ""
  );

  const isEditable =
    userRole === "admin" || (userRole === "auditee" && !isChecklistSubmitted);

  const isAuditee = userRole === "auditee";
  const isAuditor = userRole === "auditor";

  const handleCompliancyClick = (index) => {
    if (!isEditable) return;
    const newReqs = [...requirements];
    const current = newReqs[index].compliancy;
    const currentIndex = compliancyOptions.indexOf(current);
    const nextIndex = (currentIndex + 1) % compliancyOptions.length;
    newReqs[index].compliancy = compliancyOptions[nextIndex];
    setRequirements(newReqs);
  };

  const handleImageClick = (url) => {
    setPreviewImage(url);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const handleRemarksChange = (index, value) => {
    if (!isEditable) return;
    const newReqs = [...requirements];
    newReqs[index].remarks = value;
    setRequirements(newReqs);
  };

  const handleEvidenceChange = (index, file) => {
    if (!isEditable) return;
    const newReqs = [...requirements];
    newReqs[index].evidence = URL.createObjectURL(file);
    newReqs[index].fileObj = file;
    setRequirements(newReqs);
  };

  const handleRemoveEvidence = (index) => {
    if (!isEditable) return;
    const newReqs = [...requirements];
    newReqs[index].evidence = null;
    newReqs[index].fileObj = null;
    setRequirements(newReqs);
  };

  const handleSubmit = async () => {
    // Only allow submission if the user is an auditee and the checklist is editable.
    if (!isEditable || !isAuditee) {
      Swal.fire({
        icon: "error",
        title: "No Permission",
        text: "You do not have permission to submit this checklist.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    try {
      for (const req of requirements) {
        const formData = new FormData();
        formData.append("compliancy", req.compliancy || "");
        formData.append("remarks", req.remarks || "");

        if (req.fileObj) {
          formData.append("evidence", req.fileObj);
        } else if (req.evidence === null) {
          formData.append("removeEvidence", "true");
        }

        await RequirementService.updateRequirement(req.requirementId, formData);
      }

      Swal.fire({
        icon: "success",
        title: "Checklist submitted successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      // After successful submission, you should trigger a re-fetch of the audit data in the parent component (AuditeePage)
      // to reflect the new submitted status.
      handleBackToAudits();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Checklist submission failed",
        text: err.message || "An error occurred, please try again.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div>
      <button
        onClick={handleBackToAudits}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
      >
        ← Back to Audits
      </button>
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
        Audit Checklist
      </h2>
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={handleClosePreview}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90%] max-w-[90%] rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Number
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Question
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Compliancy
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Remarks
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Evidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requirements.length > 0 ? (
              requirements.map((req, index) => (
                <tr
                  key={req.requirementId}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                    {req.number}
                  </td>
                  <td className="px-4 py-3 text-center text-base text-black font-semibold">
                    {req.question}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium ${isEditable ? "cursor-pointer select-none" : ""}`}
                    onClick={() => handleCompliancyClick(index)}
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-white font-semibold ${
                        req.compliancy === "YES"
                          ? "bg-green-500"
                          : req.compliancy === "NO"
                            ? "bg-red-500"
                            : req.compliancy === "Not Applicable"
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                      }`}
                    >
                      {req.compliancy || "Not Set"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-500">
                    <textarea
                      value={req.remarks || ""}
                      onChange={(e) =>
                        handleRemarksChange(index, e.target.value)
                      }
                      className="border border-gray-300 rounded-md text-center px-3 py-2 w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y"
                      placeholder="Enter remarks..."
                      readOnly={!isEditable}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-500">
                    {req.evidence ? (
                      <div className="flex justify-center items-center space-x-4">
                        <img
                          src={
                            req.evidence.startsWith("blob:")
                              ? req.evidence
                              : `${process.env.REACT_APP_API_URL}${req.evidence}`
                          }
                          alt="Evidence"
                          className="w-20 h-20 object-cover rounded-md text-center border border-gray-300 shadow-sm cursor-pointer"
                          onClick={() =>
                            handleImageClick(
                              req.evidence.startsWith("blob:")
                                ? req.evidence
                                : `${process.env.REACT_APP_API_URL}${req.evidence}`
                            )
                          }
                        />
                        {isEditable && (
                          <button
                            onClick={() => handleRemoveEvidence(index)}
                            className="text-red-600 hover:text-red-800 text-center font-medium text-sm transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ) : (
                      isEditable && (
                        <input
                          type="file"
                          onChange={(e) =>
                            handleEvidenceChange(index, e.target.files[0])
                          }
                          className="border border-gray-300 rounded-md px-3 text-center py-2 text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      )
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500"
                >
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditable && isAuditee && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Submit Checklist
          </button>
        </div>
      )}

      {/* Optional: Add a "View Report" button for Auditors/Admins after submission */}
      {isChecklistSubmitted && (isAuditor || userRole === "admin") && (
        <div className="mt-6 flex justify-center">
          <button
            // onClick={handleViewReport} // You would need to create this function
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            View Report
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditChecklist;
