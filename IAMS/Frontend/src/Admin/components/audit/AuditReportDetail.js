import React, { useEffect, useState } from "react";
import AuditService from "../services/AuditService";

const AuditReportDetail = ({ auditId, onBack }) => {
  const [detailedReport, setDetailedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchDetailedReport = async () => {
      try {
        const data = await AuditService.getAuditReport(auditId);
        setDetailedReport(data.data.auditDetails);
        console.log("audit report", data.data.auditDetails);
      } catch (err) {
        setError("Unable to fetch detailed report data.");
        console.error("Failed to fetch detailed report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedReport();
  }, [auditId]);

  const handleImageClick = (url) => {
    setPreviewImage(url);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
        <p>Loading detailed report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-red-500">
        <p>{error}</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          Back
        </button>
      </div>
    );
  }

  if (!detailedReport) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
        <p>Detailed report not found.</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          Back
        </button>
      </div>
    );
  }

  const { auditTitle, requirements } = detailedReport;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen text-gray-800">
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
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

      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
        {auditTitle}
      </h2>
      <button
        onClick={onBack}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
      >
        &larr; Back to List
      </button>

      <div className="overflow-x-auto rounded-lg shadow-2xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Number
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Auditee
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Compliancy
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Remarks
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Evidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-center">
            {requirements && requirements.length > 0 ? (
              requirements.map((req, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium">
                    {req.number}
                  </td>
                  <td className="px-6 py-4 text-center text-base font-semibold">
                    {req.question}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {detailedReport.auditee.name || "No name"}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium `}
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-white font-semibold ${
                        req.compliancy === "YES"
                          ? "bg-green-500"
                          : req.compliancy === "NO"
                            ? "bg-red-500"
                            : req.compliancy === "Not Applicable"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                      }`}
                    >
                      {req.compliancy || "Not Set"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700">
                    {req.remarks || "No remarks"}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {req.evidence ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${req.evidence}`}
                        alt="Evidence"
                        className="w-24 h-24 object-cover rounded-md shadow-sm cursor-pointer mx-auto"
                        onClick={() =>
                          handleImageClick(
                            `${process.env.REACT_APP_API_URL}${req.evidence}`
                          )
                        }
                      />
                    ) : (
                      <span className="text-gray-500">No evidence</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No requirements in this report.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditReportDetail;
