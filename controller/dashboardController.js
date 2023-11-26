require("dotenv").config();
const helpers = require("../utilities/helper/general_helper");
const moment = require("moment");
const pool = require("../config/database");

var DashboardController = {
    analytics: async (req, res) => {
        try {
            const totalEmployeeCount = await helpers.get_common_count(
                { status: 0, deleted: 0 },
                "employees"
            );
            const activeEmployeeCount = await helpers.get_common_count(
                { status: 0, deleted: 0 },
                "employees"
            );
            const inactiveEmployeeCount = await helpers.get_common_count(
                { status: 1, deleted: 0 },
                "employees"
            );
            const currentMonthPayoutCount = await helpers.get_common_count(
                { month: moment().format("MM-YYYY") },
                "payouts"
            );
            const qb = await pool.get_connection();
            let query;
            query = `SELECT IFNULL(SUM(amount), 0) AS totalAmount
                    FROM ems_payouts
                    WHERE DATE_FORMAT(month, '%m-%Y') = '${moment().format(
                        "MM-YYYY"
                    )}';`;
            const currentMonthPayoutAmount = await qb.query(query);

            query = `SELECT IFNULL(SUM(amount), 0) AS totalAmount
                        FROM ems_payouts
                        WHERE YEAR(month) = YEAR(CURDATE());`;
            const currentYearPayoutAmount = await qb.query(query);

            query = `SELECT 
                        DATE_FORMAT(p.date, '%m-%Y') AS MONTH, 
                        IFNULL(SUM(e.amount), 0) AS totalAmount 
                    FROM 
                        (SELECT DATE_SUB(CURDATE(), INTERVAL n MONTH) AS date 
                        FROM 
                            (SELECT 0 AS n 
                            UNION ALL SELECT 1 
                            UNION ALL SELECT 2 
                            UNION ALL SELECT 3 
                            UNION ALL SELECT 4 
                            UNION ALL SELECT 5) nums) p 
                    LEFT JOIN ems_payouts e 
                        ON e.month = DATE_FORMAT(p.date, '%m-%Y') 
                    GROUP BY DATE_FORMAT(p.date, '%m-%Y') 
                    ORDER BY p.date ASC;
                    `;
            const graphChartValues = await qb.query(query);
            qb.release();

            res.status(200).json({
                status: true,
                analytics: {
                    totalEmployeeCount,
                    activeEmployeeCount,
                    inactiveEmployeeCount,
                    currentMonthPayoutCount,
                    currentMonthPayoutAmount:
                        currentMonthPayoutAmount[0]?.totalAmount,
                    currentYearPayoutAmount:
                        currentYearPayoutAmount[0]?.totalAmount,
                    graphChartValues,
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
