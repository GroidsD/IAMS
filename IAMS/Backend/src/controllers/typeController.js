import { log } from "console";
import db from "../models/index";
import TypeService from "../services/TypeService";

const getAllType = async (req, res) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "admin" && req.user.role !== "auditor")
    ) {
      return res.status(403).json({
        errCode: 1,
        errMessage: "Access denied. Only admin can get Type.",
      });
    }
    const response = await TypeService.getAllType();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: "Error from server at Type",
    });
  }
};
const createType = async (req, res) => {
  try {
    const { typeName } = req.body;
    // console.log(TypeName);

    const response = await TypeService.createType(typeName);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: "Error from server at create Type",
    });
  }
};

let updateTypeData = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        errCode: 1,
        errMessage: "Access denied. Only admin can update Type.",
      });
    }
    let data = req.body;
    let result = await TypeService.updateTypeData(data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server at update Type",
    });
  }
};
let deleteType = async (req, res) => {
  try {
    let typeId = req.query.typeId;
    if (!typeId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: Type ID",
      });
    }
    let data = await TypeService.deleteType(typeId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server at delete Type",
    });
  }
};

module.exports = {
  getAllType: getAllType,
  createType: createType,
  updateTypeData: updateTypeData,
  deleteType: deleteType,
};
