const router = require("express").Router();
const AdminRouter = require("./AdminRoute/AdminRoute");
const EmployeeRouter = require("./EmployeeRoute/EmployeeRoute");
const DashboardRouter = require("./DashboardRoute/DashboardRoute");
const PayoutRouter = require("./PayoutRoute/PayoutRoute.");

router.use("/admin", AdminRouter);
router.use("/employee", EmployeeRouter);
router.use("/dashboard", DashboardRouter);
router.use("/payout", PayoutRouter);

module.exports = router;
