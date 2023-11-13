require("dotenv").config();
const UserModel = require("../model/userModel");
const enc_dec = require("../utilities/decryptor/decryptor");
const helpers = require("../utilities/helper/general_helper");
const moment = require("moment");
let static_url = process.env.STATIC_FILE_URL;

var UserController = {
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

            const totalCount = await UserModel.get_count();

            UserModel.select_list(limit)
                .then(async (result) => {
                    let response = [];

                    for (val of result) {
                        let user_details = await helpers.get_data_list(
                            "*",
                            "user_details",
                            { user_id: val?.id }
                        );
                        let user_loan_details = await helpers.get_data_list(
                            "payment_status,due_amount",
                            "loans",
                            { user_id: val?.id }
                        );

                        let age = await helpers.calculateAge(
                            user_details[0]?.birth_date
                        );

                        temp = {
                            user_id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            user_no: val?.user_no,
                            mobile_code: val?.mobile_code
                                ? val?.mobile_code
                                : "",
                            mobile_no: val?.mobile_no ? val?.mobile_no : "",
                            status: val?.status === 0 ? "active" : "blocked",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                            select_id_type: user_details[0]?.select_id_type
                                ? user_details[0]?.select_id_type
                                : "",
                            id_front_side: user_details[0]?.id_front_side
                                ? user_details[0]?.id_front_side
                                : "",
                            id_back_side: user_details[0]?.id_back_side
                                ? user_details[0]?.id_back_side
                                : "",
                            user_image: user_details[0]?.user_image
                                ? user_details[0]?.user_image
                                : "",
                            full_name: user_details[0]?.full_name
                                ? user_details[0]?.full_name
                                : "",
                            card_no: user_details[0]?.card_no
                                ? user_details[0]?.card_no
                                : "",
                            birth_date: user_details[0]?.birth_date
                                ? user_details[0]?.birth_date
                                : "",
                            age: age,
                            gender: user_details[0]?.gender
                                ? user_details[0]?.gender
                                : "",
                            blood_group: user_details[0]?.blood_group
                                ? user_details[0]?.blood_group
                                : "",
                            occupation: user_details[0]?.occupation
                                ? user_details[0]?.occupation
                                : "",
                            education: user_details[0]?.education
                                ? user_details[0]?.education
                                : "",
                            salary_range: user_details[0]?.salary_range
                                ? user_details[0]?.salary_range
                                : "",
                            residence_type: user_details[0]?.residence_type
                                ? user_details[0]?.residence_type
                                : "",
                            first_person_name: user_details[0]
                                ?.first_person_name
                                ? user_details[0]?.first_person_name
                                : "",
                            first_phone: user_details[0]?.first_phone
                                ? user_details[0]?.first_phone
                                : "",
                            first_relation: user_details[0]?.first_relation
                                ? user_details[0]?.first_relation
                                : "",
                            second_person_name: user_details[0]
                                ?.second_person_name
                                ? user_details[0]?.second_person_name
                                : "",
                            second_phone: user_details[0]?.second_phone
                                ? user_details[0]?.second_phone
                                : "",
                            second_relation: user_details[0]?.second_relation
                                ? user_details[0]?.second_relation
                                : "",
                            third_person_name: user_details[0]
                                ?.third_person_name
                                ? user_details[0]?.third_person_name
                                : "",
                            third_phone: user_details[0]?.third_phone
                                ? user_details[0]?.third_phone
                                : "",
                            third_relation: user_details[0]?.third_relation
                                ? user_details[0]?.third_relation
                                : "",
                            account_holder_name: user_details[0]
                                ?.account_holder_name
                                ? user_details[0]?.account_holder_name
                                : "",
                            account_number: user_details[0]?.account_number
                                ? user_details[0]?.account_number
                                : "",
                            ifsp_code: user_details[0]?.ifsp_code
                                ? user_details[0]?.ifsp_code
                                : "",
                            due_balance: user_loan_details[0]?.due_amount
                                ? user_loan_details[0]?.due_amount
                                : 0,
                            loan_activity: user_loan_details[0]?.payment_status,
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response,
                        message: "User list fetched successfully!",
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
            let id;
            if (req.bodyString("user_id")) {
                id = enc_dec.decrypt(req.bodyString("user_id"));
            } else if (req.user.type == "user") {
                id = req.user.id;
            }
            UserModel.select({ id: id })
                .then(async (result) => {
                    let response = [];
                    console.log(result[0]);
                    if (result[0].details_added) {
                        await UserModel.select_details({
                            user_id: id,
                        }).then(async (details) => {
                            let loan_id = await helpers.get_data_list(
                                "id",
                                "loans",
                                { user_id: id }
                            );

                            for (let val of details) {
                                let age = await helpers.calculateAge(
                                    val?.birth_date
                                );
                                let totalLoanCount =
                                    await helpers.totalLoanCount(val?.user_id);
                                let totalLoanAmount =
                                    await helpers.totalUserLoanAmount(
                                        val?.user_id
                                    );
                                let TotalLoanPaidAmount =
                                    await helpers.TotalLoanPaidAmount(
                                        val?.user_id
                                    );
                                let customerBarge = await helpers.customerBadge(
                                    val?.user_id
                                );

                                let temp = {
                                    user_id: enc_dec.encrypt(id),
                                    // loan_id: enc_dec.encrypt(loan_id[0]?.id),
                                    mobile_code: result[0]?.mobile_code
                                        ? result[0]?.mobile_code
                                        : "",
                                    mobile_no: result[0]?.mobile_no
                                        ? result[0]?.mobile_no
                                        : "",
                                    status:
                                        result[0]?.status === 0
                                            ? "active"
                                            : "blocked",
                                    user_info: result[0]?.user_info,
                                    basic_info: result[0]?.basic_info,
                                    contact_info: result[0]?.contact_info,
                                    bank_info: result[0]?.bank_info,
                                    details_added: result[0]?.details_added,
                                    select_id_type: val?.select_id_type
                                        ? val?.select_id_type
                                        : "",
                                    id_front_side: val?.id_front_side
                                        ? val?.id_front_side
                                        : "",
                                    id_back_side: val?.id_back_side
                                        ? val?.id_back_side
                                        : "",
                                    user_image: val?.user_image
                                        ? val?.user_image
                                        : "",
                                    full_name: val?.full_name
                                        ? val?.full_name
                                        : "",
                                    card_no: val?.card_no ? val?.card_no : "",
                                    birth_date: val?.birth_date
                                        ? val?.birth_date
                                        : "",
                                    age: age,
                                    gender: val?.gender ? val?.gender : "",
                                    blood_group: val?.blood_group
                                        ? val?.blood_group
                                        : "",
                                    occupation: val?.occupation
                                        ? val?.occupation
                                        : "",
                                    education: val?.education
                                        ? val?.education
                                        : "",
                                    salary_range: val?.salary_range
                                        ? val?.salary_range
                                        : "",
                                    residence_type: val?.residence_type
                                        ? val?.residence_type
                                        : "",
                                    first_person_name: val?.first_person_name
                                        ? val?.first_person_name
                                        : "",
                                    first_phone: val?.first_phone
                                        ? val?.first_phone
                                        : "",
                                    first_relation: val?.first_relation
                                        ? val?.first_relation
                                        : "",
                                    second_person_name: val?.second_person_name
                                        ? val?.second_person_name
                                        : "",
                                    second_phone: val?.second_phone
                                        ? val?.second_phone
                                        : "",
                                    second_relation: val?.second_relation
                                        ? val?.second_relation
                                        : "",
                                    third_person_name: val?.third_person_name
                                        ? val?.third_person_name
                                        : "",
                                    third_phone: val?.third_phone
                                        ? val?.third_phone
                                        : "",
                                    third_relation: val?.third_relation
                                        ? val?.third_relation
                                        : "",
                                    account_holder_name:
                                        val?.account_holder_name
                                            ? val?.account_holder_name
                                            : "",
                                    account_number: val?.account_number
                                        ? val?.account_number
                                        : "",
                                    ifsp_code: val?.ifsp_code
                                        ? val?.ifsp_code
                                        : "",
                                    totalLoanCount: totalLoanCount,
                                    totalLoanAmount: totalLoanAmount,
                                    TotalLoanPaidAmount: TotalLoanPaidAmount,
                                    customerBarge,
                                    created_at: val?.created_at
                                        ? val?.created_at
                                        : "",
                                };
                                response.push(temp);
                            }
                        });
                    } else {
                        let temp = {
                            id: enc_dec.encrypt(id),
                            mobile_code: result[0]?.mobile_code
                                ? result[0]?.mobile_code
                                : "",
                            mobile_no: result[0]?.mobile_no
                                ? result[0]?.mobile_no
                                : "",
                            status:
                                result[0]?.status === 0 ? "active" : "blocked",
                            user_info: result[0]?.user_info,
                            basic_info: result[0]?.basic_info,
                            contact_info: result[0]?.contact_info,
                            bank_info: result[0]?.bank_info,
                            details_added: result[0]?.details_added,
                        };
                        response.push(temp);
                    }

                    res.status(200).json({
                        status: true,
                        data: response[0],
                        message: "User details fetched successfully!",
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

    block_unblock: async (req, res) => {
        let user_id = enc_dec.decrypt(req.bodyString("user_id"));
        let status = req.bodyString("status");
        console.log(status);
        let msgStatus = "";
        if (status == 1) {
            msgStatus = "blocked";
        } else {
            msgStatus = "active";
        }
        try {
            let user_data = {
                status: status,
                updated_at: moment().format("YYYY-MM-DD HH:mm"),
            };
            await UserModel.updateUser({ id: user_id }, user_data);
            res.status(200).json({
                status: true,
                message: `User ${msgStatus} successfully!`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },

    delete: async (req, res) => {
        let user_id = enc_dec.decrypt(req.bodyString("user_id"));
        try {
            await UserModel.delete({ id: user_id });
            res.status(200).json({
                status: true,
                message: "User deleted successfully!",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },

    user_info: async (req, res) => {
        try {
            let user_info = {
                user_id: req.user.id,
                select_id_type: req.bodyString("select_id_type"),
                full_name: req.bodyString("full_name"),
                card_no: req.bodyString("card_no"),
                birth_date: req.bodyString("birth_date"),
                gender: req.bodyString("gender"),
                blood_group: req.bodyString("blood_group"),
                id_front_side:
                    static_url + "customer/" + req.all_files?.id_front_side,
            };
            if (req.all_files?.id_back_side) {
                user_info.id_back_side =
                    static_url + "customer/" + req.all_files?.id_back_side;
            }

            await UserModel.add_Details(user_info)
                .then((result) => {
                    if (result) {
                        UserModel.updateUser(
                            { id: req.user.id },
                            { user_info: 1 }
                        )
                            .then((result) => {
                                res.status(200).json({
                                    status: true,
                                    message:
                                        "User info submitted successfully!",
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(500).json({
                                    status: false,
                                    message: "Internal server error!",
                                });
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: "Unable to submit user info. Try again!",
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

    basic_info: async (req, res) => {
        try {
            let basic_info = {
                occupation: req.bodyString("occupation"),
                education: req.bodyString("education"),
                salary_range: req.bodyString("salary_range"),
                residence_type: req.bodyString("residence_type"),
            };

            await UserModel.updateDetails({ user_id: req.user.id }, basic_info)
                .then((result) => {
                    if (result) {
                        UserModel.updateUser(
                            { id: req.user.id },
                            { basic_info: 1 }
                        )
                            .then((result) => {
                                res.status(200).json({
                                    status: true,
                                    message:
                                        "User basic info submitted successfully!",
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(500).json({
                                    status: false,
                                    message: "Internal server error!",
                                });
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: "Unable to submit basic info. Try again!",
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

    contact_info: async (req, res) => {
        try {
            let contact_info = {
                first_person_name: req.bodyString("first_person_name"),
                first_phone: req.bodyString("first_phone"),
                first_relation: req.bodyString("first_relation"),
            };
            if (req.bodyString("second_person_name")) {
                contact_info.second_person_name =
                    req.bodyString("second_person_name");
                contact_info.second_phone = req.bodyString("second_phone");
                contact_info.second_relation =
                    req.bodyString("second_relation");
            }
            if (req.bodyString("third_person_name")) {
                contact_info.third_person_name =
                    req.bodyString("third_person_name");
                contact_info.third_phone = req.bodyString("third_phone");
                contact_info.third_relation = req.bodyString("third_relation");
            }

            await UserModel.updateDetails(
                { user_id: req.user.id },
                contact_info
            )
                .then((result) => {
                    if (result) {
                        UserModel.updateUser(
                            { id: req.user.id },
                            { contact_info: 1 }
                        )
                            .then((result) => {
                                res.status(200).json({
                                    status: true,
                                    message:
                                        "User contact info submitted successfully!",
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(500).json({
                                    status: false,
                                    message: "Internal server error!",
                                });
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: "Unable to submit contact info. Try again!",
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

    user_image: async (req, res) => {
        try {
            let profile_img = {
                user_image:
                    static_url + "customer/" + req.all_files?.user_image,
            };
            await UserModel.updateDetails({ user_id: req.user.id }, profile_img)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "User image submitted successfully!",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: "Unable to submit image. Try again!",
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

    bank_details: async (req, res) => {
        try {
            let bank_details = {
                account_holder_name: req.bodyString("account_holder_name"),
                account_number: req.bodyString("account_number"),
                ifsp_code: req.bodyString("ifsp_code"),
            };
            await UserModel.updateDetails(
                { user_id: req.user.id },
                bank_details
            )
                .then((result) => {
                    if (result) {
                        UserModel.updateUser(
                            { id: req.user.id },
                            { bank_info: 1, details_added: 1 }
                        )
                            .then((result) => {
                                res.status(200).json({
                                    status: true,
                                    message:
                                        "User bank details submitted successfully!",
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(500).json({
                                    status: false,
                                    message: "Internal server error!",
                                });
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: "Unable to submit bank details. Try again!",
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

    enc: async (req, res) => {
        try {
            let data = req.bodyString("data");
            let enc = enc_dec.encrypt(data);
            res.status(200).json({
                status: true,
                data: enc,
                error: "encrypted data",
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

module.exports = UserController;
