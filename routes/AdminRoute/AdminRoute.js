const router = require("express").Router();
const AdminController = require("../../controller/adminController");
const checkAdminToken = require("../../middleware/tokenmanager/checkAdminToken");

router.post("/send_otp", AdminController.send_otp);
router.post("/verify_otp", AdminController.otp_verify);
router.post("/add_password", checkAdminToken, AdminController.add_password);
router.post("/login", AdminController.login);
router.post("/check-admin", AdminController.check_admin);
router.post(
    "/password_verify_otp",
    checkAdminToken,
    AdminController.password_otp_verify
);
router.post(
    "/change-password",
    checkAdminToken,
    AdminController.change_password
);

module.exports = router;
