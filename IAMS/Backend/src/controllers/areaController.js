import { log } from "console";
import db from "../models/index";
import AreaService from "../services/AreaService";

const getAllArea = async (req, res) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "admin" && req.user.role !== "auditor")
    ) {
      return res.status(403).json({
        errCode: 1,
        errMessage: "Access denied. Only admin can get Area.",
      });
    }
    const response = await AreaService.getAllArea();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: "Error from server at Area",
    });
  }
};
const createArea = async (req, res) => {
  try {
    const { areaName } = req.body;
    // console.log(areaName);

    const response = await AreaService.createArea(areaName);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: "Error from server at create Area",
    });
  }
};

let updateAreaData = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        errCode: 1,
        errMessage: "Access denied. Only admin can update area.",
      });
    }
    let data = req.body;
    let result = await AreaService.updateAreaData(data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server at update Area",
    });
  }
};
let deleteArea = async (req, res) => {
  try {
    let areaId = req.query.areaId;
    if (!areaId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: Area ID",
      });
    }
    let data = await AreaService.deleteArea(areaId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server at delete Area",
    });
  }
};

module.exports = {
  getAllArea: getAllArea,
  createArea: createArea,
  updateAreaData: updateAreaData,
  deleteArea: deleteArea,
};
