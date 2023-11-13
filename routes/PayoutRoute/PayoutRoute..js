const router = require("express").Router();
const PayoutController = require("../../controller/payoutController");
const checkAdminToken = require("../../middleware/tokenmanager/checkAdminToken");
const checkPermission = require("../../middleware/tokenmanager/checkpermission");

router.post("/add", checkAdminToken, PayoutController.add);
router.get("/list", checkAdminToken, PayoutController.list);
router.post("/details", checkPermission, PayoutController.details);
router.delete("/delete", checkAdminToken, PayoutController.delete);

module.exports = router;
