import express from "express";

import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";
import areaController from "../controllers/areaController";
import locationController from "../controllers/locationController";
import typeController from "../controllers/typeController";
import shiftController from "../controllers/shiftController";
import checkListController from "../controllers/checkListController";
import auditController from "../controllers/auditController";
import requirementController from "../controllers/requirementController";
const { singleUpload, userSingleUpload } = require("../middleware/upload");
const { auditUpload } = require("../middleware/uploadExcel");

let router = express.Router();
let initWebRoutes = (app) => {
  //---------------------------------------------------------------------------------------------

  // User Routes
  router.post("/api/login", userController.handleLogin);
  router.post("/api/logout", userController.handleLogout);
  // User Change Password (Need Login)
  router.post(
    "/api/change-password",
    authMiddleware,
    userController.changeMyPassword
  );
  // Admin reset Password for user
  router.post(
    "/api/reset-password",
    authMiddleware,
    adminMiddleware,
    userController.resetUserPassword
  );

  //Get Token
  router.get("/api/me", authMiddleware, userController.getCurrentUser);
  //---------------------------------------------------------------------------------------------------------
  // User Routes
  router.get(
    "/api/get-users-role",
    authMiddleware,
    userController.getUsersByRole
  );
  // Get All Users
  router.get(
    "/api/get-all-user",
    authMiddleware,
    adminMiddleware,
    userController.getAllUser
  );
  //Update User Data
  router.post(
    "/api/update-user",
    authMiddleware,
    adminMiddleware,
    userController.updateUserData
  );
  //create new user
  router.post(
    "/api/create-new-user",
    authMiddleware,
    adminMiddleware,
    userController.createNewUser
  );
  //Delete User by ID
  router.get(
    "/api/delete-user",
    authMiddleware,
    adminMiddleware,
    userController.deleteUserByID
  );
  //---------------------------------------------------------------------------------------------
  //Area route
  router.get(
    "/api/get-all-area",
    authMiddleware,
    // adminMiddleware,
    roleMiddleware(["admin", "auditor"]),
    areaController.getAllArea
  );
  router.post(
    "/api/create-new-area",
    authMiddleware,
    adminMiddleware,
    areaController.createArea
  );
  router.post(
    "/api/update-area",
    authMiddleware,
    adminMiddleware,
    areaController.updateAreaData
  );
  router.delete(
    "/api/delete-area",
    authMiddleware,
    adminMiddleware,
    areaController.deleteArea
  );
  //---------------------------------------------------------------------------------------------
  //Location route
  router.get(
    "/api/get-all-location",
    authMiddleware,
    // adminMiddleware,
    roleMiddleware(["admin", "auditor"]),
    locationController.getAllLocation
  );
  router.post(
    "/api/create-new-location",
    authMiddleware,
    adminMiddleware,
    locationController.createLocation
  );
  router.post(
    "/api/update-location",
    authMiddleware,
    adminMiddleware,
    locationController.updateLocationData
  );
  router.delete(
    "/api/delete-location",
    authMiddleware,
    adminMiddleware,
    locationController.deleteLocation
  );
  //---------------------------------------------------------------------------------------------
  //Type route
  router.get(
    "/api/get-all-type",
    authMiddleware,
    // adminMiddleware,
    roleMiddleware(["admin", "auditor"]),
    typeController.getAllType
  );
  router.post(
    "/api/create-new-type",
    authMiddleware,
    adminMiddleware,
    typeController.createType
  );
  router.post(
    "/api/update-type",
    authMiddleware,
    adminMiddleware,
    typeController.updateTypeData
  );
  router.delete(
    "/api/delete-type",
    authMiddleware,
    adminMiddleware,
    typeController.deleteType
  );
  //---------------------------------------------------------------------------------------------
  //Type route
  router.get(
    "/api/get-all-shift",
    authMiddleware,
    // adminMiddleware,
    roleMiddleware(["admin", "auditor"]),
    shiftController.getAllShift
  );
  router.post(
    "/api/create-new-shift",
    authMiddleware,
    adminMiddleware,
    shiftController.createShift
  );
  router.post(
    "/api/update-shift",
    authMiddleware,
    adminMiddleware,
    shiftController.updateShiftData
  );
  router.delete(
    "/api/delete-shift",
    authMiddleware,
    adminMiddleware,
    shiftController.deleteShift
  );
  //---------------------------------------------------------------------------------------------
  //CheckList route
  router.get(
    "/api/get-all-checklist",
    authMiddleware,
    // adminMiddleware,
    roleMiddleware(["admin", "auditor"]),
    checkListController.handleGetAllCheckLists
  );
  router.post(
    "/api/create-new-checklist",
    authMiddleware,
    adminMiddleware,
    auditUpload,
    checkListController.handleCreateCheckList
  );
  router.post(
    "/api/update-checklist",
    authMiddleware,
    adminMiddleware,
    auditUpload,
    checkListController.handleUpdateCheckList
  );
  router.delete(
    "/api/delete-checklist",
    authMiddleware,
    adminMiddleware,
    checkListController.handleDeleteCheckList
  );

  //---------------------------------------------------------------------------------------------
  //Audits route
  router.get(
    "/api/get-all-audits",
    authMiddleware,
    // adminMiddleware,
    roleMiddleware(["admin", "auditor", "auditee"]),
    auditController.handleGetAllAudits
  );
  router.get(
    "/api/get-audit-report/:id",
    authMiddleware,
    roleMiddleware(["admin", "auditor", "auditee"]),
    auditController.handleGetAuditReport
  );
  router.get(
    "/api/audits-by-auditor/:auditorId",
    authMiddleware,
    roleMiddleware(["admin", "auditor"]),
    auditController.handleGetAuditsByAuditor
  );
  // Get a single audit by ID
  router.get(
    "/api/get-audit/:id",
    authMiddleware,
    auditController.handleGetAuditById
  );
  router.post(
    "/api/create-new-audit",
    authMiddleware,
    roleMiddleware(["admin", "auditor"]),
    auditController.handleCreateNewAudit
  );
  router.post(
    "/api/update-audit/:id",
    authMiddleware,
    roleMiddleware(["admin", "auditor"]),
    auditController.handleUpdateAudit
  );
  router.post(
    "/api/update-audit-status/:id",
    authMiddleware,
    roleMiddleware(["auditee", "auditor", "admin"]),
    auditController.handleUpdateAuditStatus
  );
  router.delete(
    "/api/delete-audit/:id",
    authMiddleware,
    roleMiddleware(["admin", "auditor"]),
    auditController.handleDeleteAudit
  );
  router.get(
    "/api/get-audits-by-page",
    authMiddleware,
    // adminMiddleware,
    auditController.handleGetAuditsByPage
  );
  router.get(
    "/api/get-audits-for-auditee",
    authMiddleware,
    roleMiddleware(["auditee"]),
    auditController.handleGetAuditsByAuditeeId
  );

  //----------------------------------------------------------------------------------------------
  //Requiment Routes
  router.get(
    "/api/launch-requirements/:auditId",
    authMiddleware,
    requirementController.launchRequirements
  );

  router.post(
    "/api/update-requirement/:requirementId",
    authMiddleware,
    singleUpload,
    requirementController.updateRequirement
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;
