import express from "express";
import connection from "../config/connectDB";

let getAllProduct = async (req, res) => {
    try {
        const [rows, fields] = await (await connection).execute("SELECT * FROM product");
        return res.status(200).json({
            message: "Get all products complete!",
            data: rows
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Error",
            error: error.message
        });
    }
}



module.exports = {
    getAllProduct: getAllProduct
}