import express from "express";
import connection from "../config/connectDB";

let getAllProduct = async (req, res) => {
    try {
        const [rows, fields] = await (await connection).execute("SELECT * FROM products");
        return res.status(200).json({
            message: "Get all products complete!",
            data: rows
        });
    } catch {
        return res.status(500).json({
            message: "Error",
        });
    }
}



module.exports = {
    getAllProduct: getAllProduct
}