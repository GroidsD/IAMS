import db from "../models/index";
const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTypes = await db.Type.findAll();
      resolve({
        errCode: 0,
        message: "Get all Types successfully",
        data: allTypes,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const createType = (typeName) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeName) {
        resolve({
          errCode: 1,
          message: "Missing required parameter: TypeName",
        });
      } else {
        const newType = await db.Type.create({
          typeName: typeName,
        });

        resolve({
          errCode: 0,
          message: "Type created successfully",
          data: newType,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
// Corrected updateTypeData in TypeService.js
let updateTypeData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.typeId || !data.typeName) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }

      let type = await db.Type.findOne({
        where: { typeId: data.typeId },
      });

      if (type) {
        type.typeName = data.typeName;
        await type.save();

        let allTypes = await db.Type.findAll();
        resolve({
          errCode: 0,
          errMessage: "OK",
          data: allTypes,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Cannot find Type to update",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteType = (typeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter: TypeId",
        });
        return;
      }

      let Type = await db.Type.findOne({
        where: { typeId: typeId },
      });

      if (!Type) {
        resolve({
          errCode: 2,
          errMessage: "Type not found",
        });
      } else {
        await Type.destroy();
        resolve({
          errCode: 0,
          errMessage: "Type deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getAllType: getAllType,
  createType: createType,
  updateTypeData: updateTypeData,
  deleteType: deleteType,
};
