import express from "express";
import connection from "../config/connectDB";
import bcrypt from "bcrypt";
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
    let password = req.query.pwd;
    const salt = await bcrypt.genSalt(10);
    let encryptPassword = await bcrypt.hash(password, salt);
    try {
        await (await connection).execute(
            "INSERT INTO users (username, pwd, full_name, telephone, created_at, modified_at, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [req.query.username, encryptPassword, req.query.full_name, req.query.telephone, created_at, created_at, 3]
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

// let findUser = async (req, res) => {
//     let username = req.query.username;
//     let password = req.query.pwd;
//     try {
//         const [rows, fields] = await (await connection).execute(
//             "SELECT * FROM users WHERE username = ?",
//             [req.query.username]
//         );
//         console.log(rows);
//         const validPassword = await bcrypt.compare(password, user.password);
//         return res.status(200).json({
//             message: "Find user",
//             data: rows
//         });
//     } catch {
//         return res.status(500).json({
//             message: "Error",
//         });
//     }
// };

let findUser = async (req, res) => {
    let username = req.query.username;
    let password = req.query.pwd;
    try {
        const [rows, fields] = await (await connection).execute(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }
        return res.status(200).json({
            message: "Find user",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error",
            error: error.message
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
    updateUser: updateUser,
}

