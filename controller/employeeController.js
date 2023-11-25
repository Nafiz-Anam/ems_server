require("dotenv").config();
const EmployeeModel = require("../model/employeeModel");
const enc_dec = require("../utilities/decryptor/decryptor");
const helpers = require("../utilities/helper/general_helper");
const moment = require("moment");
let static_url = process.env.STATIC_FILE_URL;

var EmployeeController = {
    create: async (req, res) => {
        try {
            let employee_no = await helpers.make_sequential_no("EMPID");

            let employee_data = {
                employee_no: `EMPID${employee_no}`,
                profile_img:
                    static_url + "employee/" + req.all_files?.profile_img,
                id_img1: static_url + "employee/" + req.all_files?.id_img1,
                id_img2: static_url + "employee/" + req.all_files?.id_img2,
                degree_img:
                    static_url + "employee/" + req.all_files?.degree_img,
                name: req.bodyString("name"),
                email: req.bodyString("email"),
                phone: req.bodyString("phone"),
                birth_date: req.bodyString("birth_date"),
                address: req.bodyString("address"),
                city: req.bodyString("city"),
                state: req.bodyString("state"),
                zip_code: req.bodyString("zip_code"),
                country: req.bodyString("country"),
                gender: req.bodyString("gender"),
                id_type: req.bodyString("id_type"),
                last_degree: req.bodyString("last_degree"),
                contact_person1_name: req.bodyString("contact_person1_name"),
                contact_person1_phone: req.bodyString("contact_person1_phone"),
                contact_person1_relation: req.bodyString(
                    "contact_person1_relation"
                ),
                contact_person2_name: req.bodyString("contact_person2_name"),
                contact_person2_phone: req.bodyString("contact_person2_phone"),
                contact_person2_relation: req.bodyString(
                    "contact_person2_relation"
                ),
                salary: req.bodyString("salary"),
                role: req.bodyString("role"),
            };

            await EmployeeModel.add(employee_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Employee created successfully!",
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
            let search = {};
            if (req.bodyString("city")) {
                condition.city = req.bodyString("city");
            }
            if (req.bodyString("state")) {
                condition.state = req.bodyString("state");
            }
            if (req.bodyString("gender")) {
                condition.gender = req.bodyString("gender");
            }
            if (req.bodyString("role")) {
                condition.role = req.bodyString("role");
            }
            if (req.bodyString("status")) {
                condition.status = req.bodyString("status");
            }
            if (req.bodyString("search")) {
                search.name = req.bodyString("search");
                search.email = req.bodyString("email");
                search.phone = req.bodyString("phone");
            }

            const totalCount = await EmployeeModel.get_count(
                condition,
                {},
                search,
                "employees"
            );
            await EmployeeModel.select_list(
                condition,
                {},
                limit,
                search,
                "employees"
            )
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            employee_no: val?.employee_no
                                ? val?.employee_no
                                : "",
                            profile_img: val?.profile_img
                                ? val?.profile_img
                                : "",
                            name: val?.name ? val?.name : "",
                            email: val?.email ? val?.email : "",
                            phone: val?.phone ? val?.phone : "",
                            city: val?.city ? val?.city : "",
                            state: val?.state ? val?.state : "",
                            gender: val?.gender ? val?.gender : "",
                            role: val?.role ? val?.role : "",
                            salary: val?.salary ? val?.salary : "",
                            status: val?.status === 0 ? "active" : "inactive",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
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
            let id = enc_dec.decrypt(req.bodyString("employee_id"));
            let account = await helpers.get_data_list(
                "*",
                "employee_accounts",
                { employee_id: id }
            );
            EmployeeModel.select({ id: id })
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            profile_img: val?.profile_img
                                ? val?.profile_img
                                : "",
                            id_img1: val?.id_img1 ? val?.id_img1 : "",
                            id_img2: val?.id_img2 ? val?.id_img2 : "",
                            degree_img: val?.degree_img ? val?.degree_img : "",
                            name: val?.name ? val?.name : "",
                            email: val?.email ? val?.email : "",
                            phone: val?.phone ? val?.phone : "",
                            birth_date: val?.birth_date ? val?.birth_date : "",
                            address: val?.address ? val?.address : "",
                            city: val?.city ? val?.city : "",
                            state: val?.state ? val?.state : "",
                            zip_code: val?.zip_code ? val?.zip_code : "",
                            country: val?.country ? val?.country : "",
                            id_type: val?.id_type ? val?.id_type : "",
                            last_degree: val?.last_degree
                                ? val?.last_degree
                                : "",
                            gender: val?.gender ? val?.gender : "",
                            contact_person1_name: val?.contact_person1_name
                                ? val?.contact_person1_name
                                : "",
                            contact_person1_phone: val?.contact_person1_phone
                                ? val?.contact_person1_phone
                                : "",
                            contact_person1_relation:
                                val?.contact_person1_relation
                                    ? val?.contact_person1_relation
                                    : "",
                            contact_person2_name: val?.contact_person2_name
                                ? val?.contact_person2_name
                                : "",
                            contact_person2_phone: val?.contact_person2_phone
                                ? val?.contact_person2_phone
                                : "",
                            contact_person2_relation:
                                val?.contact_person2_relation
                                    ? val?.contact_person2_relation
                                    : "",
                            role: val?.role ? val?.role : "",
                            salary: val?.salary ? val?.salary : "",
                            status: val?.status === 0 ? "active" : "inactive",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        if (account.length) {
                            let account_details = {
                                account_id: account[0]?.id
                                    ? enc_dec.encrypt(account[0]?.id)
                                    : "",
                                bank_name: account[0]?.bank_name
                                    ? account[0]?.bank_name
                                    : "",
                                account_holder: account[0]?.account_holder
                                    ? account[0]?.account_holder
                                    : "",
                                account_number: account[0]?.account_number
                                    ? account[0]?.account_number
                                    : "",
                                bank_branch: account[0]?.bank_branch
                                    ? account[0]?.bank_branch
                                    : "",
                                bank_swift_code: account[0]?.bank_swift_code
                                    ? account[0]?.bank_swift_code
                                    : "",
                            };
                            temp.account_details = account_details;
                        }
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

    update_details: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("employee_id"));
            let data = { updated_at: moment().format("YYYY-MM-DD HH:mm") };

            if (req.bodyString("profile_img")) {
                data.profile_img = req.bodyString("profile_img");
            } else if (req.all_files?.profile_img) {
                data.profile_img =
                    static_url + "employee/" + req.all_files?.profile_img;
            }
            if (req.bodyString("name")) {
                data.name = req.bodyString("name");
            }
            if (req.bodyString("email")) {
                data.email = req.bodyString("email");
            }
            if (req.bodyString("phone")) {
                data.phone = req.bodyString("phone");
            }
            if (req.bodyString("birth_date")) {
                data.birth_date = req.bodyString("birth_date");
            }
            if (req.bodyString("gender")) {
                data.gender = req.bodyString("gender");
            }
            if (req.bodyString("address")) {
                data.address = req.bodyString("address");
            }
            if (req.bodyString("city")) {
                data.city = req.bodyString("city");
            }
            if (req.bodyString("state")) {
                data.state = req.bodyString("state");
            }
            if (req.bodyString("zip_code")) {
                data.zip_code = req.bodyString("zip_code");
            }
            if (req.bodyString("country")) {
                data.country = req.bodyString("country");
            }

            await EmployeeModel.updateDetails({ id: id }, agent_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Details updated successfully!",
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

    add_bank_details: async (req, res) => {
        try {
            let data = {
                employee_id: enc_dec.decrypt(req.bodyString("employee_id")),
                bank_name: req.bodyString("bank_name"),
                account_holder: req.bodyString("account_holder"),
                account_number: req.bodyString("account_number"),
                bank_branch: req.bodyString("bank_branch"),
                bank_swift_code: req.bodyString("bank_swift_code"),
            };

            await EmployeeModel.add_account(data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Account details added successfully!",
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

    update_bank_details: async (req, res) => {
        try {
            let data = { updated_at: moment().format("YYYY-MM-DD HH:mm") };

            if (req.bodyString("bank_name")) {
                data.bank_name = req.bodyString("bank_name");
            }
            if (req.bodyString("account_holder")) {
                data.account_holder = req.bodyString("account_holder");
            }
            if (req.bodyString("account_number")) {
                data.account_number = req.bodyString("account_number");
            }
            if (req.bodyString("bank_branch")) {
                data.bank_branch = req.bodyString("bank_branch");
            }
            if (req.bodyString("bank_swift_code")) {
                data.bank_swift_code = req.bodyString("bank_swift_code");
            }

            await EmployeeModel.update_account(
                { id: enc_dec.decrypt(req.bodyString("account_id")) },
                data
            )
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Account details updated successfully!",
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

    bank_details: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("account_id"));
            await EmployeeModel.select2({ id })
                .then(async (result) => {
                    let response = [];

                    for (let val of result) {
                        let employee_name = await helpers.get_data_list(
                            "name",
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
                                    ? employee_name[0]?.name
                                    : "",
                            bank_name: val?.bank_name ? val?.bank_name : "",
                            account_holder: val?.account_holder
                                ? val?.account_holder
                                : "",
                            account_number: val?.account_number
                                ? val?.account_number
                                : "",
                            bank_branch: val?.bank_branch
                                ? val?.bank_branch
                                : "",
                            bank_swift_code: val?.bank_swift_code
                                ? val?.bank_swift_code
                                : "",
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

    account_list: async (req, res) => {
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
            let search = {};
            if (req.bodyString("bank_name")) {
                condition.bank_name = req.bodyString("bank_name");
            }
            if (req.bodyString("bank_branch")) {
                condition.bank_branch = req.bodyString("bank_branch");
            }

            if (req.bodyString("search")) {
                search.account_holder = req.bodyString("account_holder");
                search.account_number = req.bodyString("account_number");
                search.bank_swift_code = req.bodyString("bank_swift_code");
            }

            const totalCount = await EmployeeModel.get_count(
                condition,
                {},
                search,
                "employee_accounts"
            );
            await EmployeeModel.select_list(
                condition,
                {},
                limit,
                search,
                "employee_accounts"
            )
                .then(async (result) => {
                    let response = [];

                    for (let val of result) {
                        let employee_name = await helpers.get_data_list(
                            "name",
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
                                    ? employee_name[0]?.name
                                    : "",
                            bank_name: val?.bank_name ? val?.bank_name : "",
                            account_holder: val?.account_holder
                                ? val?.account_holder
                                : "",
                            account_number: val?.account_number
                                ? val?.account_number
                                : "",
                            bank_branch: val?.bank_branch
                                ? val?.bank_branch
                                : "",
                            bank_swift_code: val?.bank_swift_code
                                ? val?.bank_swift_code
                                : "",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
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

    contact_info: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("employee_id"));
            let data = { updated_at: moment().format("YYYY-MM-DD HH:mm") };

            if (req.bodyString("contact_person1_relation")) {
                data.contact_person1_relation = req.bodyString(
                    "contact_person1_relation"
                );
            }
            if (req.bodyString("contact_person1_phone")) {
                data.contact_person1_phone = req.bodyString(
                    "contact_person1_phone"
                );
            }
            if (req.bodyString("contact_person1_name")) {
                data.contact_person1_name = req.bodyString(
                    "contact_person1_name"
                );
            }
            if (req.bodyString("contact_person2_relation")) {
                data.contact_person2_relation = req.bodyString(
                    "contact_person2_relation"
                );
            }
            if (req.bodyString("contact_person2_phone")) {
                data.contact_person2_phone = req.bodyString(
                    "contact_person2_phone"
                );
            }
            if (req.bodyString("contact_person2_name")) {
                data.contact_person2_name = req.bodyString(
                    "contact_person2_name"
                );
            }

            await EmployeeModel.updateDetails({ id: id }, data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Contact details updated successfully!",
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

    update_kyc: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("employee_id"));
            let data = { updated_at: moment().format("YYYY-MM-DD HH:mm") };

            if (req.bodyString("id_type")) {
                data.id_type = req.bodyString("id_type");
            }

            if (req.bodyString("id_img1")) {
                data.id_img1 = req.bodyString("id_img1");
            } else if (req.all_files?.id_img1) {
                data.id_img1 =
                    static_url + "employee/" + req.all_files?.id_img1;
            }

            if (req.bodyString("id_img2")) {
                data.id_img2 = req.bodyString("id_img2");
            } else if (req.all_files?.id_img2) {
                data.id_img2 =
                    static_url + "employee/" + req.all_files?.id_img2;
            }

            await EmployeeModel.updateDetails({ id: id }, data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "KYC details updated successfully!",
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

    update_academic_info: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("employee_id"));
            let data = { updated_at: moment().format("YYYY-MM-DD HH:mm") };

            if (req.bodyString("last_degree")) {
                data.last_degree = req.bodyString("last_degree");
            }

            if (req.bodyString("degree_img")) {
                data.degree_img = req.bodyString("degree_img");
            } else if (req.all_files?.degree_img) {
                data.degree_img =
                    static_url + "employee/" + req.all_files?.degree_img;
            }

            await EmployeeModel.updateDetails({ id: id }, data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Academic details updated successfully!",
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

    block_unblock: async (req, res) => {
        let employee_id = enc_dec.decrypt(req.bodyString("employee_id"));
        let status = req.bodyString("status");
        let msgStatus = "";
        if (status == 1) {
            msgStatus = "blocked";
        } else {
            msgStatus = "unblocked";
        }
        try {
            let user_data = {
                status: status,
                updated_at: moment().format("YYYY-MM-DD HH:mm"),
            };
            await EmployeeModel.updateDetails({ id: employee_id }, user_data);
            res.status(200).json({
                status: true,
                message: `Employee ${msgStatus} successfully!`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: `Server side error!`,
            });
        }
    },

    delete: async (req, res) => {
        let employee_id = enc_dec.decrypt(req.bodyString("employee_id"));
        try {
            let data = {
                deleted: 1,
                updated_at: moment().format("YYYY-MM-DD HH:mm"),
            };
            await EmployeeModel.updateDetails({ id: employee_id }, data);
            await EmployeeModel.updateAccountDetails(
                { employee_id: employee_id },
                data
            );
            res.status(200).json({
                status: true,
                message: `Employee deleted successfully!`,
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

module.exports = EmployeeController;
