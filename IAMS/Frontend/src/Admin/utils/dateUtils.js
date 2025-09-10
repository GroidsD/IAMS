import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
export const formatDateToInputValue = (date) =>
  date ? dayjs(date).format("YYYY-MM-DD") : "";

export const formatDateToDDMMYYYY = (date) =>
  date ? dayjs(date).format("DD/MM/YYYY") : "";

export const formatDateTimeToVietnam = (date) => {
  if (!date) return "";
  return dayjs(date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm");
};

export const calculateDueDate = (calibrationDate, frequency = 12) =>
  calibrationDate
    ? dayjs(calibrationDate).add(frequency, "month").format("YYYY-MM-DD")
    : "";

export const calculateDueDateDisplay = (calibrationDate, frequency = 12) =>
  calibrationDate
    ? dayjs(calibrationDate).add(frequency, "month").format("DD/MM/YYYY")
    : "—";
