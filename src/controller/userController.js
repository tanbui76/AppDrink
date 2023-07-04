import express from "express";
import connection from "../config/connectDB";
import bcrypt from "bcrypt";
import axios from "axios";

const API_KEY = '281ea9d6a46f5338283836891404738de3a20097';

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

async function checkExist(username) {
    console.log(username);
    let check = await (await connection).execute("SELECT * FROM users WHERE username = ?", [username]);
    if (check[0].length > 0) {
        return false;
    } else {
        return true;
    }
}


let createUser = async (req, res) => {
    try {
        let date = new Date();
        let created_at = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        let password = req.body.pwd || req.query.pwd;

        const salt = await bcrypt.genSalt(10);
        let encryptPassword = await bcrypt.hash(password, salt);

        let username = await req.body.username || req.query.username;

        if (username.includes("@")) {
            if (await checkExist(username) === false) {
                return res.status(400).json({
                    message: "Email already exists",
                });
            } else {
                await axios.get(`https://api.hunter.io/v2/email-verifier?email=${username}&api_key=${API_KEY}`).then(async (response) => {
                    const result = response.data.data;

                    if (result.result === 'undeliverable' || result.result === 'risky') {
                        return res.status(400).json({
                            message: "Email is not valid",
                        });
                    }
                }).catch(async (error) => {
                    console.log(error);
                    return res.status(500).json({
                        message: "Error not found this email",
                    });
                });

            }
        } else {
            let check = await (await connection).execute("SELECT * FROM users WHERE telephone = ?", [username]);
            if (check[0].length > 0) {
                return res.status(400).json({
                    message: "Telephone already exists",
                });
            }
        }
        (await connection).execute(
            "INSERT INTO users (username, pwd, full_name, telephone, created_at, modified_at, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [username, encryptPassword, req.query.full_name, req.query.telephone, created_at, created_at, 3]
        );
        return res.status(200).json({
            message: "Create user",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
        });
    }


};


let findUser = async (req, res) => {
    let username = req.query.username;
    let password = req.query.pwd;
    try {
        const [rows, fields] = await (await connection).execute(
            "SELECT * FROM users WHERE username = ? OR telephone = ?",
            [username, username]
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
            message: "Find user complete",
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

let deleteUser = async (req, res) => {
    try {
        await (await connection).execute(
            "DELETE FROM `db_appdrink`.`users` WHERE (`id` = ?)",
            [req.query.id]
        );
        return res.status(200).json({
            message: "Delete user",
        });

    } catch {
        return res.status(500).json({
            message: "Error",
        });
    }
}


module.exports = {
    getAllUsers: getAllUsers,
    createUser: createUser,
    updateUser: updateUser,
    findUser: findUser,
    deleteUser: deleteUser
}

