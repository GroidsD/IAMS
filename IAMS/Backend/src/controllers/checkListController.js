// src/controllers/CheckListController.js
import CheckListService from "../services/CheckListService";

let handleGetAllCheckLists = async (req, res) => {
  try {
    const data = await CheckListService.getAllCheckLists();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error from Sever.",
    });
  }
};

let handleCreateCheckList = async (req, res) => {
  try {
    const { locationId, areaId, typeId } = req.body;
    const checkListFile = req.file ? req.file.filename : null;
    const data = await CheckListService.createCheckList({
      locationId,
      areaId,
      typeId,
      checkListFile,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error from Server.",
    });
  }
};

let handleUpdateCheckList = async (req, res) => {
  try {
    const dataFromFrontend = {
      checkListId: req.body.checkListId,
      locationId: req.body.locationId,
      areaId: req.body.areaId,
      typeId: req.body.typeId,
      checkListFile: req.file ? req.file.filename : null,
      deleteOldFile: req.body.deleteOldFile,
    };

    const data = await CheckListService.updateCheckList(dataFromFrontend);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error from Sever.",
    });
  }
};

let handleDeleteCheckList = async (req, res) => {
  try {
    const { checkListId } = req.body;
    const data = await CheckListService.deleteCheckList(checkListId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error from Sever.",
    });
  }
};

module.exports = {
  handleGetAllCheckLists: handleGetAllCheckLists,
  handleCreateCheckList: handleCreateCheckList,
  handleUpdateCheckList: handleUpdateCheckList,
  handleDeleteCheckList: handleDeleteCheckList,
};
