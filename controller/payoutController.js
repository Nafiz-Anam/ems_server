require("dotenv").config();
const PayoutModel = require("../model/payoutModel");
const enc_dec = require("../utilities/decryptor/decryptor");
let static_url = process.env.STATIC_FILE_URL;
const moment = require("moment");

var PayoutController = {
    add: async (req, res) => {
        try {
            let data = {
                employee_id: enc_dec.decrypt(req.bodyString("employee_id")),
                month: req.bodyString("month"),
                amount: req.bodyString("amount"),
            };

            await PayoutModel.add(data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Payout created successfully!",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: "Internal server error!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },

    list: async (req, res) => {
        try {
            let limit = {
                perpage: 10,
                start: 0,
            };
            if (req.bodyString("perpage") && req.bodyString("page")) {
                perpage = parseInt(req.bodyString("perpage"));
                start = parseInt(req.bodyString("page"));
                limit.perpage = perpage;
                limit.start = (start - 1) * perpage;
            }
            let condition = {};

            if (req.bodyString("month")) {
                condition.month = req.bodyString("month");
            }

            const totalCount = await PayoutModel.get_count(condition);

            await PayoutModel.select_list(condition, limit)
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let employee_name = await helpers.get_data_list(
                            "full_name",
                            "employees",
                            { id: val?.employee_id }
                        );
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            employee_id: val?.employee_id
                                ? enc_dec.encrypt(val?.employee_id)
                                : "",
                            employee_name:
                                employee_name.length > 0
                                    ? employee_name[0]?.full_name
                                    : "",
                            month: val?.month ? val?.month : "",
                            amount: val?.amount ? val?.amount : "",
                            created_at: val?.created_at ? val?.created_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response,
                        message: "Employee list fetched successfully!",
                        total: totalCount,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        data: {},
                        error: "Server side error!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                data: {},
                error: "Server side error!",
            });
        }
    },

    details: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("payout_id"));
            EmployeeModel.select({ id: id })
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            employee_id: val?.employee_id
                                ? enc_dec.encrypt(val?.employee_id)
                                : "",
                            month: val?.month ? val?.month : "",
                            amount: val?.amount ? val?.amount : "",
                            created_at: val?.created_at ? val?.created_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response[0],
                        message: "Employee details fetched successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        data: {},
                        error: "Server side error!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                data: {},
                error: "Server side error!",
            });
        }
    },

    delete: async (req, res) => {
        let payout_id = enc_dec.decrypt(req.bodyString("payout_id"));
        try {
            await PayoutModel.delete({ id: payout_id });
            res.status(200).json({
                status: true,
                message: `Payout deleted successfully!`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: `Server side error!`,
            });
        }
    },
};

module.exports = PayoutController;
