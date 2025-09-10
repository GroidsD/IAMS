import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { FaRegFilePdf, FaSave, FaSync } from "react-icons/fa";
import { exportToExcel } from "../utils/exportToExcel";
import {
  formatDateToDDMMYYYY,
  calculateDueDateDisplay,
} from "../utils/dateEquipment";
import api from "../../../API/axios";
const DepartmentManagerPage = ({ goBack }) => {
  const [equipments, setEquipments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;
  const [filters, setFilters] = React.useState({
    modelNumber: "",
    type: "",
    manufacturer: "",
    serialNumber: "",
    assetNumber: "",
    location: "",
    frequency: "",
    department: "",
    status: "",
    creator: "",
    approver: "",
  });

  // useEffect(() => [user]);
  const filteredEquipments = equipments.filter((eq) => {
    return (
      eq.modelNumber
        ?.toLowerCase()
        .includes(filters.modelNumber.toLowerCase()) &&
      eq.type?.toLowerCase().includes(filters.type.toLowerCase()) &&
      eq.manufacturer
        ?.toLowerCase()
        .includes(filters.manufacturer.toLowerCase()) &&
      eq.serialNumber
        ?.toLowerCase()
        .includes(filters.serialNumber.toLowerCase()) &&
      eq.assetNumber
        ?.toLowerCase()
        .includes(filters.assetNumber.toLowerCase()) &&
      eq.location?.toLowerCase().includes(filters.location.toLowerCase()) &&
      String(eq.frequency ?? "")
        .toLowerCase()
        .includes(filters.frequency.toLowerCase()) &&
      eq.department?.toLowerCase().includes(filters.department.toLowerCase()) &&
      eq.status?.toLowerCase().includes(filters.status.toLowerCase()) &&
      eq.creator?.email
        ?.toLowerCase()
        .includes(filters.creator.toLowerCase()) &&
      eq.approver?.email?.toLowerCase().includes(filters.approver.toLowerCase())
    );
  });

  const fetchEquipments = async () => {
    try {
      const response = await api.get("/api/department-equipments");
      const equipmentList = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      const filteredList = equipmentList.filter(
        (eq) => eq.status?.toLowerCase() !== "scrapped"
      );
      console.log(response);

      setEquipments(filteredList);
    } catch (error) {
      console.error("Failed to fetch equipments", error);
      Swal.fire("Error", "Failed to load equipment data.", "error");
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const pageCount = Math.ceil(filteredEquipments.length / itemsPerPage);
  const currentItems = filteredEquipments.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const getStatusBadgeClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "maintenance":
        return "bg-orange-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "scrapped":
        return "bg-gray-500 text-white";
      default:
        return "bg-red-500 text-white";
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white shadow-2xl rounded-xl p-3 transform transition-all duration-300 hover:scale-[1.005]">
      {goBack && (
        <button
          onClick={goBack}
          className="mb-6 flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Go Back
        </button>
      )}
      <h2 className="text-3xl font-extrabold text-gray-900 text-center drop-shadow-md">
        Calibration Master List
      </h2>
      <div className="flex justify-between mb-4">
        <button
          onClick={fetchEquipments}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FaSync className="text-lg" />
          Refresh
        </button>

        <button
          onClick={() => exportToExcel(filteredEquipments)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FaSave className="text-lg" />
          Export to Excel
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        {/* <table className="max-w-full divide-y divide-gray-200"> */}
        <table className="min-w-full divide-y divide-blue-300">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="px-2 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-tl-xl">
                Model#
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Type
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Manufacturer
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Serial No.
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Asset No.
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Location
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold uppercase tracking-wider">
                Freq.
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Department
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Created By
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Approver
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Department Manager
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Cal. File
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider">
                Calib.Date
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold uppercase tracking-wider rounded-tr-xl">
                Due Date
              </th>
            </tr>
            <tr className="bg-blue-100 text-black">
              <th>
                <input
                  type="text"
                  placeholder="Search Model#"
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.modelNumber}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      modelNumber: e.target.value,
                    }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Type"
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Manufacturer"
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.manufacturer}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      manufacturer: e.target.value,
                    }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Serial No."
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.serialNumber}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      serialNumber: e.target.value,
                    }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Asset No."
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.assetNumber}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      assetNumber: e.target.value,
                    }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Location"
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Freq."
                  className="w-full px-1 py-0.5 text-xs text-center"
                  value={filters.frequency}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      frequency: e.target.value,
                    }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Department"
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.department}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Status"
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Created By"
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.creator}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, creator: e.target.value }))
                  }
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Approver"
                  className="w-full px-1 py-0.5 text-xs"
                  value={filters.approver}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      approver: e.target.value,
                    }))
                  }
                />
              </th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map((eq) => (
                <tr
                  key={eq.equipmentId}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  {/* <td className="px-2 py-2 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2"></div>
                  </td> */}
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800 font-medium">
                    {eq.modelNumber}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.type}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.manufacturer}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.serialNumber}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.assetNumber}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.location}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-center text-xs text-gray-800">
                    {eq.frequency}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.department}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md ${getStatusBadgeClasses(
                        eq.status
                      )}`}
                    >
                      {eq.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.creator?.email}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.approver ? eq.approver.email : "N/A"}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.departmentManager ? eq.departmentManager.email : "N/A"}
                  </td>
                  <td className="px-2 py-2 text-xs text-gray-800 border-r border-gray-200">
                    {eq.calibrationFilePath ? (
                      <a
                        href={`${process.env.REACT_APP_API_URL}/${eq.calibrationFilePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-0.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors duration-200 border border-red-200 shadow-sm"
                        title="View PDF"
                      >
                        <FaRegFilePdf className="text-base" />
                        <span className="font-medium ">PDF</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        No file
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.lastCalibrationDate
                      ? formatDateToDDMMYYYY(eq.lastCalibrationDate)
                      : "N/A"}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-800">
                    {eq.calibrationDueDate
                      ? formatDateToDDMMYYYY(eq.calibrationDueDate)
                      : calculateDueDateDisplay(
                          eq.lastCalibrationDate,
                          eq.frequency
                        )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="16"
                  className="px-6 py-10 text-center text-gray-500 text-lg"
                >
                  No equipment found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< Previous"
          containerClassName="flex justify-center items-center mt-10 space-x-2"
          pageClassName="block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors duration-150 shadow-sm"
          activeClassName="!bg-blue-600 !text-white !border-blue-600 shadow-md"
          previousClassName="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors duration-150 shadow-sm"
          nextClassName="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors duration-150 shadow-sm"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default DepartmentManagerPage;
