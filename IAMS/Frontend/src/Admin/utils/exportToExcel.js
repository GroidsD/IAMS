import * as XLSX from "xlsx";
import {
  formatDateTimeToVietnam,
  formatDateToDDMMYYYY,
  calculateDueDateDisplay,
} from "./dateEquipment";

export const exportToExcel = (activeEquipments) => {
  // Prepare the data for export
  const dataToExport = activeEquipments.map((eq) => ({
    "Model#": eq.modelNumber || "",
    Type: eq.type || "",
    Manufacturer: eq.manufacturer || "",
    "Serial#": eq.serialNumber || "",
    "Asset#": eq.assetNumber || "",
    Location: eq.location || "",
    Department: eq.department || "",
    "Frequency (months)": eq.frequency || "",
    Status: eq.status || "",
    "Owner Name": eq.creator?.name || "",
    "Owner Email": eq.creator?.email || "",
    "Created At": eq.createdAt ? formatDateTimeToVietnam(eq.createdAt) : "",
    "Approver Name": eq.approver?.name || "",
    "Approver Email": eq.approver?.email || "",
    "Approved At":
      eq.approvalRecords?.length > 0 && eq.approvalRecords[0].approvedAt
        ? formatDateTimeToVietnam(eq.approvalRecords[0].approvedAt)
        : "",
    "Dept. Manager Name": eq.departmentManager?.name || "",
    "Dept. Manager Email": eq.departmentManager?.email || "",
    "Calibration File": eq.calibrationFilePath ? "Yes" : "No",
    "Calibration Date": eq.lastCalibrationDate
      ? formatDateToDDMMYYYY(eq.lastCalibrationDate)
      : "",
    "Due Date": calculateDueDateDisplay(eq.lastCalibrationDate, eq.frequency),
  }));

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(dataToExport);

  // Optional: Set column widths
  ws["!cols"] = [
    { wch: 15 }, // Model#
    { wch: 15 }, // Type
    { wch: 20 }, // Manufacturer
    { wch: 15 }, // Serial#
    { wch: 15 }, // Asset#
    { wch: 15 }, // Location
    { wch: 15 }, // Department
    { wch: 15 }, // Frequency
    { wch: 15 }, // Status
    { wch: 20 }, // Owner Name
    { wch: 25 }, // Owner Email
    { wch: 20 }, // Created At
    { wch: 20 }, // Approver Name
    { wch: 25 }, // Approver Email
    { wch: 20 }, // Approved At
    { wch: 20 }, // Dept. Manager Name
    { wch: 25 }, // Dept. Manager Email
    { wch: 15 }, // Calibration File
    { wch: 15 }, // Calibration Date
    { wch: 15 }, // Due Date
  ];

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Equipment");

  // Generate Excel file and trigger download
  XLSX.writeFile(
    wb,
    `Equipment_List_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};
