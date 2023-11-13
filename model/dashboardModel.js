require("dotenv").config();
const env = process.env.ENVIRONMENT;
const config = require("../config/config.json")[env];
const pool = require("../config/database");
const dbtable = config.table_prefix + "users";
const dbtable2 = config.table_prefix + "user_details";
const review_table = config.table_prefix + "reviews";

var dbModel = {
    add: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable, data);
        qb.release();
        return response;
    },
    add_Details: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable2, data);
        qb.release();
        return response;
    },
    delete: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.where(condition).delete(dbtable);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
    select: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select("*").where(condition).get(dbtable);
        qb.release();
        return response;
    },
    select_details: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select("*").where(condition).get(dbtable2);
        qb.release();
        return response;
    },
    select_review_list: async (limit) => {
        let qb = await pool.get_connection();
        let response;
        if (limit.perpage) {
            response = await qb
                .select("*")
                .order_by("id", "desc")
                .limit(limit.perpage, limit.start)
                .get(review_table);
            qb.release();
        } else {
            response = await qb
                .select("*")
                .order_by("id", "desc")
                .get(review_table);
            qb.release();
        }
        return response;
    },
    updateDetails: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable2);
        qb.release();
        return response;
    },
    updateUser: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable);
        qb.release();
        return response;
    },
};

module.exports = dbModel;
