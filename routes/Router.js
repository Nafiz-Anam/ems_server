const router = require("express").Router();
const AdminRouter = require("./AdminRoute/AdminRoute");
const EmployeeRouter = require("./EmployeeRoute/EmployeeRoute");
const DashboardRouter = require("./DashboardRoute/DashboardRoute");
const PaymentRouter = require("./PaymentRoute/PaymentRoute");

router.use("/admin", AdminRouter);
router.use("/employee", EmployeeRouter);
// router.use("/dashboard", DashboardRouter);
// router.use("/payment", PaymentRouter);

module.exports = router;
