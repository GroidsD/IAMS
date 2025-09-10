import { log } from "console";
import db from "../models/index";
import ShiftService from "../services/ShiftService";

const getAllShift = async (req, res) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "admin" && req.user.role !== "auditor")
    ) {
      return res.status(403).json({
        errCode: 1,
        errMessage: "Access denied. Only admin can get Shift.",
      });
    }
    const response = await ShiftService.getAllShift();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: "Error from server at Shift",
    });
  }
};
const createShift = async (req, res) => {
  try {
    const { shiftName } = req.body;
    // console.log(ShiftName);

    const response = await ShiftService.createShift(shiftName);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: "Error from server at create Shift",
    });
  }
};

let updateShiftData = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        errCode: 1,
        errMessage: "Access denied. Only admin can update Shift.",
      });
    }
    let data = req.body;
    let result = await ShiftService.updateShiftData(data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server at update Shift",
    });
  }
};
let deleteShift = async (req, res) => {
  try {
    let shiftId = req.query.shiftId;
    if (!shiftId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: Shift ID",
      });
    }
    let data = await ShiftService.deleteShift(shiftId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server at delete Shift",
    });
  }
};

module.exports = {
  getAllShift: getAllShift,
  createShift: createShift,
  updateShiftData: updateShiftData,
  deleteShift: deleteShift,
};
