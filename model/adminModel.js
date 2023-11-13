require("dotenv").config();
const env = process.env.ENVIRONMENT;
const config = require("../config/config.json")[env];
const pool = require("../config/database");
const dbtable = config.table_prefix + "admins";
const dbtable2 = config.table_prefix + "otps";

var dbModel = {
    add: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable, data);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
    add_otp: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable2, data);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
    select: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select("*").where(condition).get(dbtable);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
    select_otp: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select("*").where(condition).get(dbtable2);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
    updateDetails: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
};

module.exports = dbModel;
