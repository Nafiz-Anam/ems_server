require("dotenv").config();
const env = process.env.ENVIRONMENT;
const config = require("../config/config.json")[env];
const pool = require("../config/database");
const dbtable = config.table_prefix + "employees";
const dbtable2 = config.table_prefix + "employee_accounts";
const helpers = require("../utilities/helper/general_helper");

var dbModel = {
    add: async (data) => {
        console.log("data => ", data);
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable, data);
        qb.release();
        return response;
    },
    add_account: async (data) => {
        console.log("data => ", data);
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable2, data);
        qb.release();
        return response;
    },
    select: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select("*").where(condition).get(dbtable);
        qb.release();
        return response;
    },
    select_list: async (condition, date_condition, limit, search, table) => {
        const dbtable = config.table_prefix + table;
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

        if (Object.keys(date_condition).length) {
            let date_condition_str = await helpers.get_date_between_condition(
                date_condition.from_date,
                date_condition.to_date,
                "created_at"
            );
            if (final_cond == " where ") {
                final_cond = final_cond + date_condition_str;
            } else {
                final_cond = final_cond + " and " + date_condition_str;
            }
        }

        if (Object.keys(search).length) {
            let date_like_search_str =
                await helpers.get_conditional_or_like_string(search);
            if (final_cond == " where ") {
                final_cond = final_cond + date_like_search_str;
            } else {
                final_cond = final_cond + " and " + date_like_search_str;
            }
        }

        if (final_cond == " where ") {
            final_cond = "";
        }

        let query;
        if (Object.keys(limit).length) {
            query =
                "select * from " +
                dbtable +
                final_cond +
                " ORDER BY id DESC LIMIT " +
                limit.perpage +
                " OFFSET " +
                limit.start;
        } else {
            query =
                "select * from " + dbtable + final_cond + " ORDER BY id DESC";
        }

        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response;
    },
    get_count: async (condition, date_condition, search, table) => {
        const dbtable = config.table_prefix + table;

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

        if (Object.keys(date_condition).length) {
            let date_condition_str = await helpers.get_date_between_condition(
                date_condition.from_date,
                date_condition.to_date,
                "created_at"
            );
            if (final_cond == " where ") {
                final_cond = final_cond + date_condition_str;
            } else {
                final_cond = final_cond + " and " + date_condition_str;
            }
        }

        if (Object.keys(search).length) {
            let date_like_search_str =
                await helpers.get_conditional_or_like_string(search);
            if (final_cond == " where ") {
                final_cond = final_cond + date_like_search_str;
            } else {
                final_cond = final_cond + " and " + date_like_search_str;
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
    updateDetails: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
    updateAccountDetails: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable2);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
    update_account: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable2);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
};

module.exports = dbModel;
