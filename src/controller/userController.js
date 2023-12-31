import express from "express";
import connection from "../config/connectDB";
import bcrypt from "bcrypt";
import axios from "axios";
import getConnection from "../config/connectDB";

const API_KEY = '281ea9d6a46f5338283836891404738de3a20097';

let getAllUsers = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows, fields] = await connection.execute("SELECT * FROM users");
        return res.status(200).json({
            message: "Get all users",
            data: rows
        });
    } catch {
        return res.status(500).json({
            message: "Error",
        });

    } finally {
        connection.end();
    }
};

async function checkExist(username) {
    let connection;
    try {
        connection = await getConnection();
        console.log(username);
        let check = await connection.execute("SELECT * FROM users WHERE email = ?", [username]);
        if (check[0].length > 0) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        
    }

}


let createUser = async (req, res) => {
    let connection;
    try {
        let date = new Date();
        let created_at = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        let password = req.body.pwd || req.query.pwd;
        let email;
        let telephone;
        const salt = await bcrypt.genSalt(10);
        let encryptPassword = await bcrypt.hash(password, salt);

        let email_or_phone = await req.body.email_or_phone || req.query.email_or_phone;
        connection = await getConnection();

        if (email_or_phone.includes("@")) {
            email = email_or_phone;
            telephone = "";
            if (await checkExist(email_or_phone) === false) {
                return res.status(400).json({
                    message: "Email already exists",
                    code: "1"
                });
            } else {
                await axios.get(`https://api.hunter.io/v2/email-verifier?email=${email_or_phone}&api_key=${API_KEY}`).then(async (response) => {
                    const result = response.data.data;

                    if (result.result === 'undeliverable' || result.result === 'risky') {
                        return res.status(400).json({
                            message: "Email is not valid",
                            code: "2"
                        });
                    }
                }).catch(async (error) => {
                    console.log(error);
                    return res.status(500).json({
                        message: "Error not found this email",
                        code: "3"
                    });
                });

            }
        } else {
            email = "";
            telephone = email_or_phone;
            let checkNumber = await connection.execute("SELECT * FROM users WHERE telephone = ?", [email_or_phone]);
            if (checkNumber[0].length > 0) {
                return res.status(400).json({
                    message: "Telephone already exists",
                    code: "4"
                });
            }
        }
        await connection.execute(
            "INSERT INTO users (email, pwd, full_name, telephone, created_at, modified_at, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [email, encryptPassword, req.body.full_name, telephone, created_at, created_at, 3]
        );
        return res.status(200).json({
            message: "Create user",
            code: "5"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
            parameter: "email_or_phone,pwd,full_name",
            code: "6"
        });
    } finally{
        connection.end();
    }


};


let findUser = async (req, res) => {
    let username = req.query.email_or_phone || req.body.email_or_phone;
    let password = req.query.pwd || req.body.pwd;
    let connection;
    try {
        connection = await getConnection();
        const [rows, fields] = await connection.execute(
            "SELECT * FROM users WHERE email = ? OR telephone = ?",
            [username, username]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.pwd);
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
            parameter: "email_or_pass,pwd",
            error: error.message
        });
    } finally {
        connection.end();
    }
};

let updateUser = async (req, res) => {
    let date = new Date();
    let modified_at = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    let connection;
    try {
        connection = await getConnection();
        await connection.execute(
            "UPDATE `db_appdrink`.`users` SET `username` = ?, `pwd` = ?, `full_name` = ?, `telephone` = ?, `modified_at` = ? WHERE (`id` = ?)",
            [req.query.username, req.query.pwd, req.query.full_name, req.query.telephone, modified_at, req.query.id]
        );
    } catch {
        return res.status(500).json({
            message: "Error",
        });
    } finally{
        connection.end();
    }
};

let deleteUser = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        await connection.execute(
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
    } finally{
        connection.end();
    }
}


module.exports = {
    getAllUsers: getAllUsers,
    createUser: createUser,
    updateUser: updateUser,
    findUser: findUser,
    deleteUser: deleteUser
}

