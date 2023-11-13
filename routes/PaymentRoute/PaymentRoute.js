const router = require("express").Router();
const PaymentController = require("../../controller/paymentController");
const checkAdminToken = require("../../middleware/tokenmanager/checkAdminToken");
const checkpermission = require("../../middleware/tokenmanager/checkpermission");

router.post("/account-details", checkAdminToken, PaymentController.add_details);
router.get("/account-details", checkpermission, PaymentController.get_details);
router.post("/repayment", checkpermission, PaymentController.repayment);
router.post("/rollover", checkpermission, PaymentController.rollover);

module.exports = router;
