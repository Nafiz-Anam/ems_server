const router = require("express").Router();
const DashboardController = require("../../controller/dashboardController");
const checkAdminToken = require("../../middleware/tokenmanager/checkAdminToken");

router.post("/analytics", DashboardController.analytics);
router.post("/generate-report", DashboardController.report);

module.exports = router;
