// // src/utils/dateUtils.js
// import dayjs from "dayjs";

// export const formatDateToInputValue = (date) =>
//   date ? dayjs(date).format("YYYY-MM-DD") : "";

// export const formatDateToDDMMYYYY = (date) =>
//   date ? dayjs(date).format("DD/MM/YYYY") : "N/A";

// export const calculateDueDate = (calibrationDate, frequency) =>
//   calibrationDate && frequency && !isNaN(parseInt(frequency))
//     ? dayjs(calibrationDate)
//         .add(parseInt(frequency), "month")
//         .format("YYYY-MM-DD")
//     : "";

// export const calculateDueDateDisplay = (calibrationDate, frequency) =>
//   calibrationDate && frequency && !isNaN(parseInt(frequency))
//     ? dayjs(calibrationDate)
//         .add(parseInt(frequency), "month")
//         .format("DD/MM/YYYY")
//     : "N/A";
// src/utils/dateUtils.js
import dayjs from "dayjs";

export const formatDateToInputValue = (date) =>
  date ? dayjs(date).format("YYYY-MM-DD") : "";

export const formatDateToDDMMYYYY = (date) =>
  date ? dayjs(date).format("DD/MM/YYYY") : "N/A";

export const formatDateTimeToVietnam = (date) => {
  if (!date) return "";
  return dayjs(date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm");
};
export const calculateDueDate = (calibrationDate, frequency) =>
  calibrationDate && frequency && !isNaN(parseInt(frequency))
    ? dayjs(calibrationDate)
        .add(parseInt(frequency), "month")
        .format("YYYY-MM-DD")
    : "";

export const calculateDueDateDisplay = (calibrationDate, frequency) =>
  calibrationDate && frequency && !isNaN(parseInt(frequency))
    ? dayjs(calibrationDate)
        .add(parseInt(frequency), "month")
        .format("DD/MM/YYYY")
    : "N/A";
