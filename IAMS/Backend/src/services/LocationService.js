import db from "../models/index";
const getAllLocation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allLocations = await db.Location.findAll();
      resolve({
        errCode: 0,
        message: "Get all Locations successfully",
        data: allLocations,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const createLocation = (locationName) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!locationName) {
        resolve({
          errCode: 1,
          message: "Missing required parameter: LocationName",
        });
      } else {
        const newLocation = await db.Location.create({
          locationName: locationName,
        });

        resolve({
          errCode: 0,
          message: "Location created successfully",
          data: newLocation,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
// Corrected updateLocationData in LocationService.js
let updateLocationData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.locationId || !data.locationName) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }

      let location = await db.Location.findOne({
        where: { locationId: data.locationId },
      });

      if (location) {
        location.locationName = data.locationName;
        await location.save();

        let allLocations = await db.Location.findAll();
        resolve({
          errCode: 0,
          errMessage: "OK",
          data: allLocations,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Cannot find Location to update",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteLocation = (locationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!locationId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter: LocationId",
        });
        return;
      }

      let location = await db.Location.findOne({
        where: { locationId: locationId },
      });

      if (!location) {
        resolve({
          errCode: 2,
          errMessage: "Location not found",
        });
      } else {
        await location.destroy();
        resolve({
          errCode: 0,
          errMessage: "Location deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getAllLocation: getAllLocation,
  createLocation: createLocation,
  updateLocationData: updateLocationData,
  deleteLocation: deleteLocation,
};
