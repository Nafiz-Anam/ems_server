require("dotenv").config();
const helpers = require("../utilities/helper/general_helper");

var DashboardController = {
    analytics: async (req, res) => {
        try {
            const employeeCount = await helpers.get_common_count(
                { status: 0, deleted: 0 },
                "employees"
            );

            res.status(200).json({
                status: true,
                analytics: {
                    employeeCount,
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
