const env = process.env.ENVIRONMENT;
const config = require("../../config/config.json")[env];
const pool = require("../../config/database");
const axios = require("axios");
const useragent = require("express-useragent");
const requestIp = require("request-ip");

const randomString = (length, capslock = 0) => {
    let chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    if (capslock == 1) {
        return result.toUpperCase();
    } else {
        return result;
    }
};

var helpers = {
    generatePassword: async () => {
        let randomPass = await randomString(8);
        console.log("randomPass", randomPass);
        return randomPass;
    },
    get_data_list: async (selection, dbtable, condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select(selection)
            .where(condition)
            .get(config.table_prefix + dbtable);
        console.log(qb.last_query());
        qb.release();
        return response;
    },
    common_select_list: async (condition, limit, table) => {
        console.log(condition);
        console.log(limit);
        let qb = await pool.get_connection();
        let response;
        if (Object.keys(condition).length) {
            response = await qb
                .select("*")
                .where(condition)
                .order_by("id", "desc")
                .limit(limit.perpage)
                .offset(limit.start)
                .get(config.table_prefix + table);
        } else {
            response = await qb
                .select("*")
                .order_by("id", "desc")
                .limit(limit.perpage)
                .offset(limit.start)
                .get(config.table_prefix + table);
        }
        console.log("query => ", qb.last_query());
        qb.release();
        return response;
    },
    common_get_count: async (condition, table) => {
        let qb = await pool.get_connection();
        let final_cond = " where ";
        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }
        if (final_cond == " where ") {
            final_cond = "";
        }
        let query =
            "select count(*) as total from " +
            config.table_prefix +
            table +
            final_cond;
        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response[0]?.total;
    },
    delete_common_entry: async (condition, dbtable) => {
        const qb = await pool.get_connection();
        const response = await qb.delete(
            config.table_prefix + dbtable,
            condition
        );
        qb.release();
        // console.log(qb.last_query());
        return response;
    },
    get_common_count: async (condition, table) => {
        const dbtable = config.table_prefix + table;
        const qb = await pool.get_connection();
        let final_cond = " where ";
        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }
        if (final_cond == " where ") {
            final_cond = "";
        }
        let query = "select count(*) as total from " + dbtable + final_cond;
        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response[0]?.total;
    },
    generateOtp: async (size) => {
        const zeros = "0".repeat(size - 1);
        const x = parseFloat("1" + zeros);
        const y = parseFloat("9" + zeros);
        const confirmationCode = String(Math.floor(x + Math.random() * y));
        return confirmationCode;
    },
    common_add: async (data, table) => {
        let qb = await pool.get_connection();
        let response = await qb
            .returning("id")
            .insert(config.table_prefix + table, data);
        qb.release();
        return response;
    },
    common_update: async (condition, data, table) => {
        let qb = await pool.get_connection();
        let response = await qb
            .set(data)
            .where(condition)
            .update(config.table_prefix + table);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
    make_sequential_no: async (pre) => {
        let qb = await pool.get_connection();
        let response = "";
        switch (pre) {
            case "EMPID":
                response = await qb
                    .select("employee_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "employees");
                break;
        }
        qb.release();
        let numberPart = 100001;
        if (response[0]?.employee_no) {
            numberPart = parseInt(response[0].employee_no.match(/\d+/)[0]) + 1;
        }
        return numberPart;
    },
    getUserInfo: async (req) => {
        const userAgent = useragent.parse(req.headers["user-agent"]);
        const ip = requestIp.getClientIp(req);
        try {
            const response = await axios.get(
                `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEO_LOCATION_API}&ip=${ip}`
            );
            const { country_name: country } = response.data;
            return {
                deviceName: userAgent.device,
                browser: userAgent.browser,
                ip,
                country,
            };
        } catch (error) {
            console.error("Error fetching IP geolocation:", error);
        }
    },
    get_date_between_condition: async (from_date, to_date, db_date_field) => {
        return (
            "DATE(" +
            db_date_field +
            ") BETWEEN '" +
            from_date +
            "' AND '" +
            to_date +
            "'"
        );
    },
};

module.exports = helpers;
