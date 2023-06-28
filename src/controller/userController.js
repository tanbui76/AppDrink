import express from "express";
import connection from "../config/connectDB";

let getAllUsers = async (req, res) => {
    try {
        const [rows, fields] = await (await connection).execute("SELECT * FROM users");
        return res.status(200).json({
            message: "Get all users",
            data: rows
        });
    } catch {
        return res.status(500).json({
            message: "Error",
        });

    }
};


let createUser = async (req, res) => {
    let date = new Date();
    let created_at = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    try {
        await (await connection).execute(
            "INSERT INTO users (username, pwd, full_name, telephone, created_at, modified_at, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [req.query.username, req.query.pwd, req.query.full_name, req.query.telephone, created_at, created_at, 3]
        );
        return res.status(200).json({
            message: "Create user",
        });
    } catch {
        return res.status(500).json({
            message: "Error",
        });
    }


};

let updateUser = async (req, res) => {
    let date = new Date();
    let modified_at = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    try {
        await (await connection).execute(
            "UPDATE `db_appdrink`.`users` SET `username` = ?, `pwd` = ?, `full_name` = ?, `telephone` = ?, `modified_at` = ? WHERE (`id` = ?)",
            [req.query.username, req.query.pwd, req.query.full_name, req.query.telephone, modified_at, req.query.id]
        );
    } catch {
        return res.status(500).json({
            message: "Error",
        });
    }
};

module.exports = {
    getAllUsers: getAllUsers,
    createUser: createUser,
    updateUser: updateUser
}

