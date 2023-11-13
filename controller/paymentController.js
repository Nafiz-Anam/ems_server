require("dotenv").config();
const PaymentModel = require("../model/paymentModel");
const enc_dec = require("../utilities/decryptor/decryptor");
let static_url = process.env.STATIC_FILE_URL;
const moment = require("moment");

var PaymentController = {
    repayment: async (req, res) => {
        try {
            console.log("req.all_files", req.all_files);
            let repayment_data = {
                voucher_img:
                    static_url + "product/" + req.all_files?.voucher_img,
                loan_id: enc_dec.decrypt(req.bodyString("loan_id")),
                user_id: enc_dec.decrypt(req.bodyString("user_id")),
                utr: req.bodyString("utr"),
                amount: req.bodyString("amount"),
            };

            await PaymentModel.add(repayment_data, "repayment")
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Repayment successful!",
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

    rollover: async (req, res) => {
        try {
            console.log("req.all_files", req.all_files);
            let rollover_data = {
                voucher_img:
                    static_url + "product/" + req.all_files?.voucher_img,
                loan_id: enc_dec.decrypt(req.bodyString("loan_id")),
                user_id: enc_dec.decrypt(req.bodyString("user_id")),
                utr: req.bodyString("utr"),
                amount: req.bodyString("amount"),
            };

            await PaymentModel.add(rollover_data, "rollover")
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Rollover successful!",
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

    repayment_list: async (req, res) => {
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

            if (req.bodyString("user_id")) {
                condition.user_id = enc_dec.decrypt(req.bodyString("user_id"));
            }

            const totalCount = await PaymentModel.get_count(
                condition,
                "repayment"
            );
            console.log(totalCount);

            PaymentModel.select_list(condition, limit, "repayment")
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            voucher_img: val?.voucher_img
                                ? val?.voucher_img
                                : "",
                            loan_id: val?.loan_id
                                ? enc_dec.encrypt(val?.loan_id)
                                : "",
                            user_id: val?.user_id
                                ? enc_dec.encrypt(val?.user_id)
                                : "",
                            utr: val?.utr ? val?.utr : "",
                            amount: val?.amount ? val?.amount : 0,
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response,
                        message: "Repayment list fetched successfully!",
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

    rollover_list: async (req, res) => {
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

            if (req.bodyString("user_id")) {
                condition.user_id = enc_dec.decrypt(req.bodyString("user_id"));
            }

            const totalCount = await PaymentModel.get_count(
                condition,
                "rollover"
            );
            console.log(totalCount);

            PaymentModel.select_list(condition, limit, "rollover")
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            voucher_img: val?.voucher_img
                                ? val?.voucher_img
                                : "",
                            loan_id: val?.loan_id
                                ? enc_dec.encrypt(val?.loan_id)
                                : "",
                            user_id: val?.user_id
                                ? enc_dec.encrypt(val?.user_id)
                                : "",
                            utr: val?.utr ? val?.utr : "",
                            amount: val?.amount ? val?.amount : 0,
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response,
                        message: "Rollover list fetched successfully!",
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

    add_details: async (req, res) => {
        try {
            const formattedExpiry = moment(
                req.bodyString("expiry"),
                "DD-MM-YYYY HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss");
            let account_data = {
                name: req.bodyString("name"),
                vpa_upi: req.bodyString("vpa_upi"),
                expiry: formattedExpiry,
            };

            await PaymentModel.add(account_data, "account")
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Account added successfully!",
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

    get_details: async (req, res) => {
        try {
            PaymentModel.select()
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            name: val?.name ? val?.name : "",
                            vpa_upi: val?.vpa_upi ? val?.vpa_upi : "",
                            expiry: val?.expiry ? val?.expiry : "",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response[0],
                        message: "Account details fetched successfully!",
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

    get_rollover_details: async (req, res) => {
        try {
            let condition = {
                id: enc_dec.decrypt(req.bodyString("id")),
            };
            await PaymentModel.select_specific(condition, "rollover")
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            voucher_img: val?.voucher_img
                                ? val?.voucher_img
                                : "",
                            loan_id: val?.loan_id
                                ? enc_dec.encrypt(val?.loan_id)
                                : "",
                            user_id: val?.user_id
                                ? enc_dec.encrypt(val?.user_id)
                                : "",
                            utr: val?.utr ? val?.utr : "",
                            amount: val?.amount ? val?.amount : 0,
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response[0],
                        message: "Rollover details fetched successfully!",
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

    get_repayment_details: async (req, res) => {
        try {
            let condition = {
                id: enc_dec.decrypt(req.bodyString("id")),
            };
            await PaymentModel.select_specific(condition, "repayment")
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            voucher_img: val?.voucher_img
                                ? val?.voucher_img
                                : "",
                            loan_id: val?.loan_id
                                ? enc_dec.encrypt(val?.loan_id)
                                : "",
                            user_id: val?.user_id
                                ? enc_dec.encrypt(val?.user_id)
                                : "",
                            utr: val?.utr ? val?.utr : "",
                            amount: val?.amount ? val?.amount : 0,
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response[0],
                        message: "Repayment details fetched successfully!",
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

    
};

module.exports = PaymentController;
