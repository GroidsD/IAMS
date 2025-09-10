import db from "../models/index";
const fs = require("fs").promises;
const path = require("path");

const getAllCheckLists = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCheckLists = await db.CheckList.findAll({
        include: [
          {
            model: db.Area,
            as: "area",
            attributes: ["areaId", "areaName"],
          },
          {
            model: db.Location,
            as: "location",
            attributes: ["locationId", "locationName"],
          },
          {
            model: db.Type,
            as: "type",
            attributes: ["typeId", "typeName"],
          },
        ],
      });
      resolve({
        errCode: 0,
        message: "Get All checkList Successfull!",
        data: allCheckLists,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createCheckList = (checkListData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { locationId, areaId, typeId, checkListFile } = checkListData;
      if (!locationId || !areaId || !typeId || !checkListFile) {
        return resolve({
          errCode: 1,
          message: "Lack parameter required.",
        });
      }

      // 1. Lấy thông tin chi tiết từ các bảng liên quan
      const location = await db.Location.findByPk(locationId);
      const area = await db.Area.findByPk(areaId);
      const type = await db.Type.findByPk(typeId);

      // 2. Kiểm tra nếu một trong các mục không tồn tại
      if (!location || !area || !type) {
        return resolve({
          errCode: 2,
          message: "Location, Area hoặc Type nonexits.",
        });
      }

      // 3. Tạo tiêu đề dựa trên tên của Location, Area và Type
      const checkListTitle = `${location.locationName}_${area.areaName}_${type.typeName}`;

      // 4. Tạo checklist mới với tiêu đề đã được tạo
      const newCheckList = await db.CheckList.create({
        locationId,
        areaId,
        typeId,
        checkListFile,
        checkListTitle, // Thêm trường này vào đây
      });

      resolve({
        errCode: 0,
        message: "Create CheckList successfull!",
        data: newCheckList,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateCheckList = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.checkListId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing checklist ID!",
        });
      } // Step 1: Find the existing record

      const existingChecklist = await db.CheckList.findOne({
        where: { checkListId: data.checkListId },
      });

      if (!existingChecklist) {
        return resolve({
          errCode: 2,
          errMessage: "Can't find checklist to update.",
        });
      }
      // --- Lấy thông tin mới để tạo Title mới ---
      const newLocation = await db.Location.findByPk(data.locationId);
      const newArea = await db.Area.findByPk(data.areaId);
      const newType = await db.Type.findByPk(data.typeId);

      // Tạo chuỗi title mới
      const newChecklistTitle = `${newLocation.locationName}_${newArea.areaName}_${newType.typeName}`;

      const oldFileName = existingChecklist.checkListFile;
      let newFileName = oldFileName; // Default to keeping the old file // Step 2: Handle file operations

      if (data.checkListFile) {
        newFileName = data.checkListFile;
        if (oldFileName) {
          const oldFilePath = path.join(
            __dirname,
            "..",
            "public",
            "uploadsExcel",
            oldFileName
          );
          try {
            await fs.unlink(oldFilePath);
          } catch (fileErr) {
            if (fileErr.code !== "ENOENT") {
              console.error(`Error deleting old file: ${oldFilePath}`, fileErr);
            }
          }
        }
      } else if (data.deleteOldFile === "true" && oldFileName) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "public",
          "uploadsExcel",
          oldFileName
        );
        try {
          await fs.unlink(oldFilePath);
          newFileName = null;
        } catch (fileErr) {
          if (fileErr.code !== "ENOENT") {
            console.error(`Error clearing file: ${oldFilePath}`, fileErr);
          }
          newFileName = null;
        }
      } // Step 3: Update the database record with new information and file name

      const [affectedRows] = await db.CheckList.update(
        {
          locationId: data.locationId,
          areaId: data.areaId,
          typeId: data.typeId,
          checkListTitle: newChecklistTitle, // Thêm dòng này để cập nhật title
          checkListFile: newFileName,
        },
        {
          where: { checkListId: data.checkListId },
        }
      ); // Step 4: Resolve the promise with the result

      if (affectedRows > 0) {
        resolve({
          errCode: 0,
          errMessage: "Update checklist successful!",
        });
      } else {
        resolve({
          errCode: 3,
          errMessage: "No changes were made to the checklist.",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCheckList = (checkListId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!checkListId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing checklist ID!",
        });
      }

      const checklist = await db.CheckList.findOne({
        where: { checkListId: checkListId },
      });

      if (!checklist) {
        return resolve({
          errCode: 2,
          errMessage: "Could not find checklist ID to delete.",
        });
      }

      const fileName = checklist.checkListFile;

      // Step 2: Delete the physical file from the server if it exists
      if (fileName) {
        try {
          // Correct path construction:
          // __dirname is at /src/services
          // '..' goes up to /src
          // 'public/uploadsExcel' then goes into the correct folders
          const filePath = path.join(
            __dirname,
            "..",
            "public",
            "uploadsExcel",
            fileName
          );
          await fs.unlink(filePath);
          // console.log(`Successfully deleted file: ${filePath}`);
        } catch (fileErr) {
          if (fileErr.code === "ENOENT") {
            console.warn(
              `File not found, but continuing deletion: ${fileName}`
            );
          } else {
            console.error(
              `An unexpected error occurred while deleting file ${fileName}:`,
              fileErr
            );
            throw fileErr;
          }
        }
      }

      // Step 3: Delete the record from the database
      await checklist.destroy();

      resolve({
        errCode: 0,
        errMessage: "Checklist deleted successfully!",
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getAllCheckLists: getAllCheckLists,
  createCheckList: createCheckList,
  updateCheckList: updateCheckList,
  deleteCheckList: deleteCheckList,
};
