const router = require("express").Router();
const EmployeeController = require("../../controller/employeeController");
const checkAdminToken = require("../../middleware/tokenmanager/checkAdminToken");
const checkPermission = require("../../middleware/tokenmanager/checkpermission");
const employeeUploader = require("../../middleware/uploads/employeeUploader");

router.post(
    "/create",
    checkAdminToken,
    employeeUploader,
    EmployeeController.create
);
router.post("/list", checkAdminToken, EmployeeController.list);
router.post("/list/dropdown", checkAdminToken, EmployeeController.dropdown);
router.post("/account_list", checkAdminToken, EmployeeController.account_list);
router.post("/details", checkPermission, EmployeeController.details);
router.post(
    "/update",
    checkAdminToken,
    EmployeeController.update_details
);
router.post(
    "/update/contact_info",
    checkAdminToken,
    employeeUploader,
    EmployeeController.contact_info
);
router.post(
    "/update/kyc",
    checkAdminToken,
    employeeUploader,
    EmployeeController.update_kyc
);
router.post(
    "/update/academic-info",
    checkAdminToken,
    employeeUploader,
    EmployeeController.update_academic_info
);
router.post(
    "/add/banks-details",
    checkAdminToken,
    EmployeeController.add_bank_details
);
router.post(
    "/banks-details",
    checkAdminToken,
    EmployeeController.bank_details
);
router.post(
    "/update/banks-details",
    checkAdminToken,
    EmployeeController.update_bank_details
);
router.post(
    "/block-unblock",
    checkAdminToken,
    EmployeeController.block_unblock
);
router.post("/delete", checkAdminToken, EmployeeController.delete);

module.exports = router;
