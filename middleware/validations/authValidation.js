const Joi = require("joi");
const helpers = require("../../utilities/helper/general_helper");

const authValidation = {
    check_user: async (req, res, next) => {
        const schema = Joi.object({
            mobile_code: Joi.string().required().messages({
                "any.required": "Mobile code is required",
                "string.empty": "Mobile code cannot be empty",
            }),
            mobile_no: Joi.string().required().messages({
                "any.required": "Mobile number is required",
                "string.empty": "Mobile number cannot be empty",
            }),
        });

        try {
            let check_mobile_exist = await helpers.get_data_list("*", "users", {
                mobile_no: req.bodyString("mobile_no"),
            });
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(500).json({
                    status: false,
                    error: result.error.message,
                });
            } else if (check_mobile_exist.length > 0) {
                res.status(500).json({
                    status: false,
                    error: "Mobile number already registered. Please login!",
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                error: "Server side error!",
            });
        }
    },

    otp_verify: async (req, res, next) => {
        const schema = Joi.object({
            otp: Joi.string().required().length(4).messages({
                "any.required": "OTP is required",
                "string.length": "OTP must be exactly 4 characters long",
                "string.empty": "OTP cannot be empty",
            }),
            otp_token: Joi.string().required().messages({
                "any.required": "OTP token is required",
                "string.empty": "OTP token cannot be empty",
            }),
            password: Joi.string().required().min(6).max(16).messages({
                "any.required": "Password is required",
                "string.min": "Password must be at least 6 characters long",
                "string.max": "Password cannot exceed 16 characters",
                "string.empty": "Password cannot be empty",
            }),
        });

        try {
            let get_mobile = await helpers.get_data_list(
                "mobile_no",
                "mobile_otp",
                {
                    token: req.bodyString("otp_token"),
                }
            );

            let check_user_exist = await helpers.get_data_list("*", "users", {
                mobile_no: get_mobile[0]?.mobile_no,
                deleted: 0,
            });
            console.log(check_user_exist);

            const result = schema.validate(req.body);
            if (result.error) {
                res.status(500).json({
                    status: false,
                    error: result.error.message,
                });
            } else if (check_user_exist.length > 0) {
                res.status(500).json({
                    status: false,
                    error: "User already registered. Please login!",
                });
            } else {
                next();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                error: "Server side error!",
            });
        }
    },

    login: async (req, res, next) => {
        const schema = Joi.object({
            mobile_code: Joi.string().required().messages({
                "any.required": "Mobile code is required",
                "string.empty": "Mobile code cannot be empty",
            }),
            mobile_no: Joi.string().required().messages({
                "any.required": "Mobile number is required",
                "string.empty": "Mobile number cannot be empty",
            }),
            password: Joi.string().required().min(6).max(16).messages({
                "any.required": "Password is required",
                "string.min": "Password must be at least 6 characters long",
                "string.max": "Password cannot exceed 16 characters",
                "string.empty": "Password cannot be empty",
            }),
        });

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(500).json({
                    status: false,
                    error: result.error.message,
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                error: "Server side error!",
            });
        }
    },

    user_info: async (req, res, next) => {
        const schema = Joi.object({
            select_id_type: Joi.string()
                .valid("Adhar Card", "Pan Card")
                .required()
                .messages({
                    "any.only":
                        'Invalid id type. Must be either "Adhar Card" or "Pan Card".',
                }),
            full_name: Joi.string().required().messages({
                "string.empty": "Full name is required.",
            }),
            card_no: Joi.string().required().messages({
                "string.empty": "Card number is required.",
            }),
            birth_date: Joi.string().isoDate().required().messages({
                "string.empty": "Birth date is required.",
                "string.isoDate":
                    "Invalid birth date format. Must be in ISO date format (YYYY-MM-DD).",
            }),
            gender: Joi.string()
                .valid("male", "female", "other")
                .required()
                .messages({
                    "any.only":
                        'Invalid gender. Must be either "male", "female" or "other".',
                }),
            blood_group: Joi.string()
                .valid("O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-")
                .required()
                .messages({
                    "any.only":
                        "Invalid blood group. Must be a valid blood group type.",
                }),
        });
        try {
            const result = schema.validate(req.body);
            const dataAvailable = await helpers.check_if_user_exist(
                req.user.id,
                "user_details"
            );
            if (result.error) {
                res.status(503).json({
                    status: false,
                    error: result.error.message,
                });
            } else if (dataAvailable) {
                res.status(500).json({
                    status: false,
                    error: "User info already exists.",
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(503).json({
                status: false,
                error: "Server side error!",
            });
        }
    },

    basic_info: async (req, res, next) => {
        const schema = Joi.object({
            occupation: Joi.string()
                .valid("Salary From Service", "Earning From Business")
                .required()
                .messages({
                    "any.empty":
                        'Invalid occupation. Must be either "Salary From Service" or "Earning From Business".',
                }),
            education: Joi.string().required().messages({
                "any.required": "Education is required.",
            }),
            salary_range: Joi.string()
                .valid(
                    "₹ 5,001-₹ 10,000",
                    "₹ 10,001-₹ 20,000",
                    "₹ 20,001-₹ 35,000",
                    "₹ 35,001-₹ 50,000",
                    "₹ 50,001-₹ 1,00,000"
                )
                .required()
                .messages({
                    "any.only":
                        "Invalid salary range. Must be a valid salary range.",
                }),
            residence_type: Joi.string()
                .valid("I live on rent", "Own House")
                .required()
                .messages({
                    "any.only":
                        'Invalid residence type. Must be either "I live on rent" or "Own House".',
                }),
        });
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(503).json({
                    status: false,
                    error: result.error.message,
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(503).json({
                status: false,
                error: "Server side error!",
            });
        }
    },

    contact_info: async (req, res, next) => {
        const schema = Joi.object({
            first_person_name: Joi.string().required().messages({
                "string.empty": "First person name is required.",
            }),
            first_phone: Joi.string().required().messages({
                "string.empty": "First person phone number is required.",
            }),
            first_relation: Joi.string()
                .valid(
                    "Father/Mother",
                    "Brother/Sister",
                    "Uncle/Aunt",
                    "Friend"
                )
                .required()
                .messages({
                    "any.only":
                        "Invalid first person relation. Must be a valid relation.",
                }),
            second_person_name: Joi.string().optional().allow("").messages({
                "string.empty": "Second person name is required.",
            }),
            second_phone: Joi.string().optional().allow("").messages({
                "string.empty": "Second person phone number is required.",
            }),
            second_relation: Joi.string()
                .valid(
                    "Father/Mother",
                    "Brother/Sister",
                    "Uncle/Aunt",
                    "Friend"
                )
                .optional()
                .allow("")
                .messages({
                    "any.only":
                        "Invalid second person relation. Must be a valid relation.",
                }),
            third_person_name: Joi.string().optional().allow("").messages({
                "string.empty": "Third person name is required.",
            }),
            third_phone: Joi.string().optional().allow("").messages({
                "string.empty": "Third person phone number is required.",
            }),
            third_relation: Joi.string()
                .valid(
                    "Father/Mother",
                    "Brother/Sister",
                    "Uncle/Aunt",
                    "Friend"
                )
                .optional()
                .allow("")
                .messages({
                    "any.only":
                        "Invalid third person relation. Must be a valid relation.",
                }),
        });
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(503).json({
                    status: false,
                    error: result.error.message,
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(503).json({
                status: false,
                error: "Server side error!",
            });
        }
    },

    bank_details: async (req, res, next) => {
        const schema = Joi.object({
            account_holder_name: Joi.string().required().messages({
                "string.empty": "Account holder name is required.",
            }),
            account_number: Joi.string().required().messages({
                "string.empty": "Account number is required.",
            }),
            ifsp_code: Joi.string().required().messages({
                "string.empty": "IFSP code is required.",
            }),
        });
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(503).json({
                    status: false,
                    error: result.error.message,
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(503).json({
                status: false,
                error: "Server side error!",
            });
        }
    },
};

module.exports = authValidation;
