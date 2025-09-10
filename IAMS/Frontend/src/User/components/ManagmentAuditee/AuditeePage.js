import React, { useState, useEffect } from "react";
import AuditService from "../../../Admin/components/services/AuditService";
import RequirementService from "../../../Admin/components/services/RequirementService";
import { formatDateToDDMMYYYY } from "../utils/dateEquipment";
import AuditChecklist from "../../../Admin/components/audit/AuditCheckList";
import Swal from "sweetalert2";
import { useUser } from "../context/UserContext";
const AuditeePage = () => {
  const [audits, setAudits] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAuditId, setActiveAuditId] = useState(null);
  const { user } = useUser();
  const fetchAudits = async () => {
    try {
      setLoading(true);
      const response = await AuditService.getAuditsForAuditee();
      // Check if response exists and errCode is 0
      if (response && response.errCode === 0 && response.audits) {
        setAudits(response.audits);
      } else {
        setError("Cannot load data from API.");
      }
    } catch (err) {
      setError("Error loading audits. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleLaunch = async (auditId) => {
    try {
      setLoading(true);
      const res = await RequirementService.launchRequirements(auditId);
      if (res && res.data) {
        setRequirements(res.data);
        setActiveAuditId(auditId); // mark audit as active
      } else {
        setError("Cannot load requirements.");
      }
    } catch (err) {
      console.error(err);
      setError("Error loading requirements.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (auditId, newStatus) => {
    try {
      setLoading(true);
      const res = await AuditService.updateAuditStatus(auditId, newStatus);
      if (res && res.errCode === 0) {
        // Success notification
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Status updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchAudits();
      } else {
        // Failure notification
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Failed to update status",
          text: res.errMessage,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.error(err);
      // General error notification
      Swal.fire({
        position: "center",
        icon: "error",
        title: "An error occurred!",
        text: "Could not update status.",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAudits = () => {
    setActiveAuditId(null);
    setRequirements([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-semibold p-4 bg-red-100 rounded-lg shadow-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-2xl rounded-xl p-8 max-w-full mx-auto my-4 overflow-hidden">
      {!activeAuditId && (
        <>
          <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
            Planned Audits
          </h2>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Auditee
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Auditors
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {audits.length > 0 ? (
                  audits.map((audit, index) => (
                    <tr
                      key={audit.auditId}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                        {audit.auditTitle}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        {audit.auditLocation?.locationName}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        {audit.auditArea?.areaName}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        {audit.auditType?.typeName}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        {formatDateToDDMMYYYY(audit.dateAudit)}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        <div className="font-medium text-gray-900">
                          {audit.auditee?.name}
                        </div>
                        <div className="text-xs text-center text-gray-400">
                          {audit.auditee?.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        {audit.auditors?.map((auditor, idx) => (
                          <div key={idx} className="mb-1 last:mb-0">
                            <div className="font-medium text-gray-900">
                              {auditor.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {auditor.email}
                            </div>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${audit.status === "Planned" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${audit.status === "Confirmed" ? "bg-green-100 text-green-800" : ""}
                          ${audit.status === "Reschedule" ? "bg-blue-100 text-blue-800" : ""}
                          ${audit.status === "Canceled" ? "bg-red-100 text-red-800" : ""}
                        `}
                        >
                          {audit.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                        {audit.status === "Planned" && (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(audit.auditId, "Confirmed")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(audit.auditId, "Reschedule")
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                              Reschedule
                            </button>
                          </div>
                        )}
                        {audit.status === "Confirmed" && (
                          <button
                            onClick={() => handleLaunch(audit.auditId)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                          >
                            Launch
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500"
                    >
                      No pending audits found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {activeAuditId && (
        <AuditChecklist
          requirements={requirements}
          setRequirements={setRequirements}
          handleBackToAudits={handleBackToAudits}
          userRole={user?.role}
        />
      )}
    </div>
  );
};

export default AuditeePage;
