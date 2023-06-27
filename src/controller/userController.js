import express from "express";
import connection from "../config/connectDB";

let getAllUsers = async (req, res) => {
    const [rows, fields] = await (await connection).execute("SELECT * FROM users");
    return res.status(200).json({
        message: "Get all users",
        data: rows
    });
};
// let createUser = async (req, res) => {
//     let { user_id, username, pwd, full_name, telephone, created_at, modified_at, role_id } = req.body;
//     await (await connection).execute(
//         'INSERT INTO `users` (`user_id`,`username`, `pwd`, `full_name`, `telephone`, `created_at`, `modified_at`, `role_id`) VALUES (?,?,?,?,?,?,?,?)',
//         [user_id, username, pwd, full_name, telephone, created_at, modified_at, role_id]
//     );

//     return res.status(200).json({
//         message: "Create user",
//     });
// };

let createUser = async (req, res) => {
    let { username, pwd, full_name, telephone, created_at, modified_at, role_id } = req.body;

    username = username || null;
    pwd = pwd || null;
    full_name = full_name || null;
    telephone = telephone || null;
    created_at = created_at || null;
    modified_at = modified_at || null;
    role_id = role_id || null;
    await (await connection).execute(
        "INSERT INTO users (username, pwd, full_name, telephone, created_at, modified_at, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [req.query.username, req.query.pwd, req.query.full_name, req.query.telephone, req.query.created_at, req.query.modified_at, req.query.role_id]
    );

    // Thực hiện truy vấn SQL với các tham số đã kiểm tra và thiết lập
    // await (await connection).execute(
    //     "INSERT INTO users (username, pwd, full_name, telephone, created_at, modified_at, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    //     [username, pwd, full_name, telephone, created_at, modified_at, role_id]
    // );

    return res.status(200).json({
        message: "Create user",
    });
};

module.exports = {
    getAllUsers: getAllUsers,
    createUser: createUser
}

