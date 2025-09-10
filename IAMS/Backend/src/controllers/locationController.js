import { log } from "console";
import db from "../models/index";
import LocationService from "../services/LocationService";

const getAllLocation = async (req, res) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "admin" && req.user.role !== "auditor")
    ) {
      return res.status(403).json({
        errCode: 1,
        errMessage: "Access denied. Only admin can get Location.",
      });
    }
    const response = await LocationService.getAllLocation();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: "Error from server at Location",
    });
  }
};
const createLocation = async (req, res) => {
  try {
    const { locationName } = req.body;
    // console.log(LocationName);

    const response = await LocationService.createLocation(locationName);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      message: "Error from server at create Location",
    });
  }
};

let updateLocationData = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        errCode: 1,
        errMessage: "Access denied. Only admin can update Location.",
      });
    }
    let data = req.body;
    let result = await LocationService.updateLocationData(data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server at update Location",
    });
  }
};
let deleteLocation = async (req, res) => {
  try {
    let locationId = req.query.locationId;
    if (!locationId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: Location ID",
      });
    }
    let data = await LocationService.deleteLocation(locationId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server at delete Location",
    });
  }
};

module.exports = {
  getAllLocation: getAllLocation,
  createLocation: createLocation,
  updateLocationData: updateLocationData,
  deleteLocation: deleteLocation,
};
