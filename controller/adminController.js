require("dotenv").config();
const AdminModel = require("../model/adminModel");
const accessToken = require("../middleware/tokenmanager/token");
const enc_dec = require("../utilities/decryptor/decryptor");
const helpers = require("../utilities/helper/general_helper");
const email_service = require("../utilities/mail/emailService");
const SequenceUUID = require("sequential-uuid");

var AdminController = {
    send_otp: async (req, res) => {
        const { email } = req.body;
        try {
            let otp = await helpers.generateOtp(6);
            const title = "Employee Management System";
            const message =
                "Welcome to " +
                title +
                "! Your verification code is: " +
                otp +
                ". Do not share it with anyone.";

            await email_service(email, message, "Signup OTP code")
                .then(async (data) => {
                    const uuid = new SequenceUUID({
                        valid: true,
                        dashes: true,
                        unsafeBuffer: true,
                    });
                    let token = uuid.generate();
                    let ins_data = {
                        email,
                        otp: otp,
                        token: token,
                    };
                    await AdminModel.add_otp(ins_data)
                        .then(async (result) => {
                            res.status(200).json({
                                status: true,
                                token: token,
                                message: "Otp sent on your email.",
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(500).json({
                                status: false,
                                message: error.message,
                            });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: error.message,
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    otp_verify: async (req, res) => {
        try {
            const condition = {
                otp: req.bodyString("otp"),
                token: req.bodyString("token"),
            };

            const result = await AdminModel.select_otp(condition);
            console.log(result);

            if (!result.length) {
                return res.status(401).json({
                    status: false,
                    message: "Wrong OTP, Try again!",
                });
            }

            let userData = {
                email: result[0]?.email,
                type: "admin",
            };

            const insertionResult = await AdminModel.add(userData);

            if (insertionResult.insert_id) {
                const payload = {
                    id: insertionResult?.insert_id,
                    type: "admin",
                };
                const token = accessToken(payload);

                await helpers.delete_common_entry( condition , "otps");

                return res.status(200).json({
                    status: true,
                    token,
                    message: "OTP verified. Admin created successfully!",
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: "Error creating admin.",
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },

    add_password: async (req, res) => {
        try {
            const { password } = req.body;
            const hashPassword = enc_dec.encrypt(password);

            const user_data = {
                name: req.bodyString("name"),
                password: hashPassword,
            };
            const condition = { id: req.user?.id };

            await AdminModel.updateDetails(condition, user_data);

            const payload = { id: req.user?.id, type: req.user?.type };
            const token = accessToken(payload);

            return res.status(200).json({
                status: true,
                token,
                message: "Admin data added successfully!",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                message: "Server side error!",
            });
        }
    },

    login: async (req, res) => {
        try {
            let foundUser = await AdminModel.select({
                email: req.bodyString("email"),
            });

            if (foundUser.length > 0) {
                let submittedPass = req.bodyString("password");
                let plainPassword = await enc_dec.decrypt(
                    foundUser[0]?.password
                );

                if (submittedPass === plainPassword) {
                    payload = {
                        id: foundUser[0].id,
                        type: foundUser[0].type,
                    };
                    const token = accessToken(payload);

                    res.status(200).json({
                        status: true,
                        token: token,
                        message: "Admin logged in successfully!",
                    });
                } else {
                    res.status(401).json({
                        status: false,
                        data: {},
                        error: "Wrong Password!",
                    });
                }
            } else {
                res.status(404).json({
                    status: false,
                    data: {},
                    error: "Admin not found!",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },

    check_admin: async (req, res) => {
        try {
            let foundUser = await AdminModel.select({
                email: req.bodyString("email"),
            });
            const otp = await helpers.generateOtp(6);
            const message = `Your verification code is: ${otp}. Do not share it with anyone.`;

            if (foundUser.length > 0) {
                await email_service(
                    req.bodyString("email"),
                    message,
                    "Forgot password OTP"
                ).then(async (result) => {
                    // adding otp entry
                    let otp_payload = {
                        otp: otp,
                        user_id: foundUser[0].id,
                    };
                    await AdminModel.add_otp(otp_payload);

                    let payload = {
                        id: foundUser[0].id,
                        type: foundUser[0].type,
                    };
                    const token = accessToken(payload);

                    res.status(200).json({
                        status: true,
                        token: token,
                        message: "Verification OTP sent successfully!",
                    });
                });
            } else {
                res.status(404).json({
                    status: false,
                    data: {},
                    error: "Admin not found!",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },

    password_otp_verify: async (req, res) => {
        try {
            const condition = {
                otp: req.bodyString("otp"),
                user_id: req.user.id,
            };

            const result = await AdminModel.select_otp(condition);

            if (!result) {
                return res.status(401).json({
                    status: false,
                    message: "Wrong OTP, Try again!",
                });
            }

            let resultUser = await AdminModel.select({
                id: req.user.id,
            });

            if (resultUser.length) {
                // jwt token
                const payload = {
                    id: resultUser[0].id,
                    type: resultUser[0].type,
                };
                const token = accessToken(payload);

                // delete OTP entry from table
                await helpers.delete_common_entry(condition, "otps");

                return res.status(200).json({
                    status: true,
                    token: token,
                    message: "OTP verified.",
                });
            } else {
                return res.status(404).json({
                    status: false,
                    message: "User not found!",
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },

    change_password: async (req, res) => {
        try {
            let admin_data = {
                password: enc_dec.encrypt(req.bodyString("password")),
            };
            await AdminModel.updateDetails({ id: req.user.id }, admin_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Password updated successfully!",
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
};

module.exports = AdminController;
