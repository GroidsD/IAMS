import { useUser } from "../../../User/components/context/UserContext";
import AuditService from "../../../Admin/components/services/AuditService";

import React, { useState, useEffect } from "react";
import { formatDateToDDMMYYYY } from "../utils/dateEquipment";

const ResponeAuditors = () => {
  const { user } = useUser();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAuditId, setEditingAuditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const showMessage = (title, text, icon) => {
    alert(`${title}\n\n${text}`);
  };

  useEffect(() => {
    const fetchAudits = async () => {
      if (!user?.userId) return;
      setLoading(true);
      try {
        const response = await AuditService.getAuditsByAuditor(user.userId);
        setAudits(response?.data || []);
        setError(null);
      } catch (err) {
        setError("A system error has occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, [user]);

  const handleEditClick = (audit) => {
    setEditingAuditId(audit.auditId);
    // Khởi tạo dữ liệu form với thông tin hiện tại của audit
    setEditFormData({
      auditTitle: audit.auditTitle,
      dateAudit: audit.dateAudit,
      locationId: audit.locationId,
      areaId: audit.areaId,
      typeId: audit.typeId,
      shiftId: audit.shiftId,
    });
  };

  const handleCancelEdit = () => {
    setEditingAuditId(null);
    setEditFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateAudit = async (auditId) => {
    setLoading(true);
    try {
      // Giả sử có một API để cập nhật audit details
      // Bạn cần tạo phương thức này trong AuditService
      const response = await AuditService.updateAudit(auditId, editFormData);

      if (response.errCode === 0) {
        // Cập nhật state với dữ liệu mới từ response
        setAudits(
          audits.map((audit) =>
            audit.auditId === auditId
              ? { ...audit, ...response.data.updatedAudit }
              : audit
          )
        );
        showMessage(
          "Success!",
          "Audit has been updated successfully.",
          "success"
        );
        handleCancelEdit(); // Thoát khỏi chế độ chỉnh sửa
      } else {
        showMessage("Error!", response.errMessage, "error");
      }
    } catch (err) {
      showMessage("Error!", "Unable to update audit.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPlanned = async (auditId) => {
    setLoading(true);
    try {
      const response = await AuditService.updateAuditStatus(auditId, "Planned");
      if (response.errCode === 0) {
        setAudits(
          audits.map((audit) =>
            audit.auditId === auditId ? { ...audit, status: "Planned" } : audit
          )
        );
        setEditingAuditId(null);
        showMessage("Success!", "Status has been updated.", "success");
      } else {
        setError(response.errMessage);
        showMessage("Error!", response.errMessage, "error");
      }
    } catch (err) {
      setError("Unable to update status.");
      showMessage("Error!", "Unable to update status.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAudit = async (auditId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel?\nThis action cannot be undone!"
    );
    if (isConfirmed) {
      setLoading(true);
      try {
        const response = await AuditService.updateAuditStatus(
          auditId,
          "Canceled"
        );
        if (response.errCode === 0) {
          setAudits(
            audits.map((audit) =>
              audit.auditId === auditId
                ? { ...audit, status: "Canceled" }
                : audit
            )
          );
          showMessage(
            "Canceled!",
            "Audit has been canceled successfully.",
            "success"
          );
        } else {
          showMessage("Error!", response.errMessage, "error");
        }
      } catch (err) {
        showMessage("Error!", "Unable to cancel audit.", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-sans">
        <p className="text-gray-600 text-lg">Loading audits list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-sans">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen font-sans">
      <div className="w-full max-w bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
          Audits List Respond
        </h2>
        {audits.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No audits found.</p>
        ) : (
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
                    Shift
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {audits.map((audit) => (
                  <tr
                    key={audit.auditId}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Render inputs in edit mode, otherwise render text */}
                    {editingAuditId === audit.auditId ? (
                      <>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                          <input
                            type="text"
                            name="auditTitle"
                            value={editFormData.auditTitle}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditLocation?.locationName}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditArea?.areaName}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditType?.typeName}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditShift?.shiftName}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          <input
                            type="date"
                            name="dateAudit"
                            value={editFormData.dateAudit}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          <div className="font-bold text-gray-900">
                            {audit.auditee?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {audit.auditee?.email}
                          </div>
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditors?.map((a) => (
                            <div key={a.userId} className="mb-1">
                              <div className="font-medium text-black">
                                {a.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {a.email}
                              </div>
                            </div>
                          ))}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 font-semibold leading-tight rounded-full text-xs
                              ${audit.status === "Planned" ? "bg-yellow-100 text-yellow-800" : ""}
                              ${audit.status === "Confirmed" ? "bg-green-100 text-green-800" : ""}
                              ${audit.status === "Reschedule" ? "bg-blue-100 text-blue-800" : ""}
                              ${audit.status === "Canceled" ? "bg-red-100 text-red-800" : ""}
                            `}
                          >
                            {audit.status}
                          </span>
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUpdateAudit(audit.auditId)}
                                className="px-4 py-2 font-medium bg-green-500 text-white text-sm rounded-full shadow-md hover:bg-green-600 transition-colors duration-200"
                              >
                                Update
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 font-medium bg-gray-500 text-white text-sm rounded-full shadow-md hover:bg-gray-600 transition-colors duration-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Normal display mode */}
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                          {audit.auditTitle}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditLocation?.locationName}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditArea?.areaName}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditType?.typeName}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditShift?.shiftName}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {formatDateToDDMMYYYY(audit.dateAudit)}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          <div className="font-bold text-gray-900">
                            {audit.auditee?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {audit.auditee?.email}
                          </div>
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm text-gray-700">
                          {audit.auditors?.map((a) => (
                            <div key={a.userId} className="mb-1">
                              <div className="font-medium text-black">
                                {a.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {a.email}
                              </div>
                            </div>
                          ))}
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 font-semibold leading-tight rounded-full text-xs
                              ${audit.status === "Planned" ? "bg-yellow-100 text-yellow-800" : ""}
                              ${audit.status === "Confirmed" ? "bg-green-100 text-green-800" : ""}
                              ${audit.status === "Reschedule" ? "bg-blue-100 text-blue-800" : ""}
                              ${audit.status === "Canceled" ? "bg-red-100 text-red-800" : ""}
                            `}
                          >
                            {audit.status}
                          </span>
                        </td>
                        <td className="px-5 py-5 whitespace-nowrap text-center text-sm">
                          <div className="flex flex-col items-center space-y-2">
                            {audit.status === "Reschedule" && (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditClick(audit)}
                                  className="px-4 py-2 font-medium bg-blue-500 text-white text-sm rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleSetPlanned(audit.auditId)
                                  }
                                  className="px-4 py-2 font-medium bg-green-500 text-white text-sm rounded-full shadow-md hover:bg-green-600 transition-colors duration-200"
                                >
                                  Planned
                                </button>
                              </div>
                            )}
                            {(audit.status === "Planned" ||
                              audit.status === "Confirmed") && (
                              <button
                                className="px-4 py-2 font-medium bg-red-500 text-white text-sm rounded-full shadow-md hover:bg-red-600 transition-colors duration-200"
                                onClick={() => handleCancelAudit(audit.auditId)}
                              >
                                Cancel Audit
                              </button>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponeAuditors;
