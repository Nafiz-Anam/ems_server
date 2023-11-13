require("dotenv").config();
const helpers = require("../utilities/helper/general_helper");

var DashboardController = {
    analytics: async (req, res) => {
        try {
            const customersCount = await helpers.get_common_count({}, "users");
            const loanRequestCount = await helpers.get_common_count(
                { request_status: "pending" },
                "loans"
            );
            const loansSoldCount = await helpers.get_common_count(
                { request_status: "approve", payment_status: "unpaid" },
                "loans"
            );
            const activeLoansCount = await helpers.get_common_count(
                { loan_status: "open" },
                "loans"
            );
            const loanCancelCount = await helpers.get_common_count({
                request_status: "cancel",
            }, "loans");
            const totalDueLoanAmount = await helpers.totalDueLoanAmount();
            const totalCloseLoanAmount = await helpers.totalCloseLoanAmount();
            const totalLoanAmount = await helpers.totalLoanAmount();

            res.status(200).json({
                status: true,
                analytics: {
                    customersCount,
                    loansSoldCount,
                    activeLoansCount,
                    loanRequestCount,
                    loanCancelCount,
                    totalDueLoanAmount,
                    totalLoanAmount,
                    totalCloseLoanAmount,
                },
                message: "Analytics retrieved successfully!",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },
};

module.exports = DashboardController;
