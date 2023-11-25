const router = require("express").Router();
const PayoutController = require("../../controller/payoutController");
const checkAdminToken = require("../../middleware/tokenmanager/checkAdminToken");
const checkPermission = require("../../middleware/tokenmanager/checkpermission");

router.post("/add", checkAdminToken, PayoutController.add);
router.post("/list", checkAdminToken, PayoutController.list);
router.post("/details", checkPermission, PayoutController.details);
router.post("/delete", checkAdminToken, PayoutController.delete);

module.exports = router;
