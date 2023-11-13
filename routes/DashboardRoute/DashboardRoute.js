const router = require("express").Router();
const DashboardController = require("../../controller/dashboardController");
const checkAdminToken = require("../../middleware/tokenmanager/checkAdminToken");

router.post("/analytics",  DashboardController.analytics);

module.exports = router;
