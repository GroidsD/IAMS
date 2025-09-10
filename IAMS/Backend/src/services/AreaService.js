import db from "../models/index";
const getAllArea = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allAreas = await db.Area.findAll();
      resolve({
        errCode: 0,
        message: "Get all areas successfully",
        data: allAreas,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const createArea = (areaName) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!areaName) {
        resolve({
          errCode: 1,
          message: "Missing required parameter: areaName",
        });
      } else {
        const newArea = await db.Area.create({
          areaName: areaName,
        });

        resolve({
          errCode: 0,
          message: "Area created successfully",
          data: newArea,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
// Corrected updateAreaData in AreaService.js
let updateAreaData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.areaId || !data.areaName) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }

      let area = await db.Area.findOne({
        where: { areaId: data.areaId },
      });

      if (area) {
        area.areaName = data.areaName;
        await area.save();

        let allAreas = await db.Area.findAll();
        resolve({
          errCode: 0,
          errMessage: "OK",
          data: allAreas,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Cannot find Area to update",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteArea = (areaId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!areaId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter: areaId",
        });
        return;
      }

      let area = await db.Area.findOne({
        where: { areaId: areaId },
      });

      if (!area) {
        resolve({
          errCode: 2,
          errMessage: "Area not found",
        });
      } else {
        await area.destroy();
        resolve({
          errCode: 0,
          errMessage: "Area deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getAllArea: getAllArea,
  createArea: createArea,
  updateAreaData: updateAreaData,
  deleteArea: deleteArea,
};
