import db from "../models/index";
const getAllShift = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allShifts = await db.Shift.findAll();
      resolve({
        errCode: 0,
        message: "Get all Shifts successfully",
        data: allShifts,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const createShift = (shiftName) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!shiftName) {
        resolve({
          errCode: 1,
          message: "Missing required parameter: ShiftName",
        });
      } else {
        const newShift = await db.Shift.create({
          shiftName: shiftName,
        });

        resolve({
          errCode: 0,
          message: "Shift created successfully",
          data: newShift,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
// Corrected updateShiftData in ShiftService.js
let updateShiftData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.shiftId || !data.shiftName) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }

      let shift = await db.Shift.findOne({
        where: { shiftId: data.shiftId },
      });

      if (shift) {
        shift.shiftName = data.shiftName;
        await shift.save();

        let allShifts = await db.Shift.findAll();
        resolve({
          errCode: 0,
          errMessage: "OK",
          data: allShifts,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Cannot find Shift to update",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteShift = (shiftId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!shiftId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter: ShiftId",
        });
        return;
      }

      let shift = await db.Shift.findOne({
        where: { shiftId: shiftId },
      });

      if (!shift) {
        resolve({
          errCode: 2,
          errMessage: "Shift not found",
        });
      } else {
        await shift.destroy();
        resolve({
          errCode: 0,
          errMessage: "Shift deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getAllShift: getAllShift,
  createShift: createShift,
  updateShiftData: updateShiftData,
  deleteShift: deleteShift,
};
