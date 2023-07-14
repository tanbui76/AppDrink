import express from "express";
import getConnection from "../config/connectDB";



let getAllProduct = async (req, res) => {
    let connect = null;
    let isConnectionOpen = false;
    try {
        connect = await getConnection();
        isConnectionOpen = true;
        const [rows, fields] = await connect.execute("SELECT * FROM product");
        return res.status(200).json({
            message: "Get all products complete!",
            data: rows
        }); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
            error: error.message
        });
    } finally {
        if(isConnectionOpen){
            connect.end();
        }
    }
}

let getCategoryName = async (req,res) => {
    let connect = null;
    let isConnectionOpen = false;
    try {
        connect = await getConnection();
        isConnectionOpen = true;
       
        const [rows, fields] = await connect.execute("SELECT * FROM category ");
        return res.status(200).json({
            message: "Category name",
            data: rows
        }); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
            error: error.message,

        });
    } finally {
        if(isConnectionOpen){
            connect.end();
        }
    }
}

let getDrinkProduct = async (req, res) => {
    let connect = null;
    let isConnectionOpen = false;
    try {
        connect = await getConnection();
        isConnectionOpen = true;
        const [rows, fields] = await connect.execute("SELECT * FROM product where category_id = 1");
        return res.status(200).json({
            message: "Get drink products complete!",
            data: rows
        }); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
            error: error.message
        });
    } finally {
        if(isConnectionOpen){
            connect.end();
        }
    }
}

let getFoodProduct = async (req, res) => {
    let connect = null;
    let isConnectionOpen = false;
    try {
        connect = await getConnection();
        isConnectionOpen = true;
        const [rows, fields] = await connect.execute("SELECT * FROM product where category_id = 2");
        return res.status(200).json({
            message: "Get food products complete!",
            data: rows
        }); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
            error: error.message,
            
        });
    } finally {
        if(isConnectionOpen){
            connect.end();
        }
    }
}


let getAllProductPage = async (req, res) => {
    let connect = null;
    let isConnectionOpen = false;
    try {
      let a = req.query.page||req.body.page;
      let b = req.query.limit||req.body.limit;
      const page = parseInt(a) || 1; // Trang hiện tại, mặc định là 1
      const limit = parseInt(b) || 10; // Số lượng sản phẩm trên mỗi trang, mặc định là 10
      console.log(page);
      console.log(limit);
      connect = await getConnection();
      isConnectionOpen = true;
      const [countRows] = await connect.execute("SELECT COUNT(*) as count FROM product"); // Tổng số sản phẩm
      const count = countRows[0].count;
      console.log(count);
      var start =(page - 1) * limit;
      var end = limit;
      const [rows] = await connect.execute(`SELECT * FROM product LIMIT ${start}, ${end}`); // Lấy sản phẩm theo trang và số lượng trên mỗi trang
  
      return res.status(200).json({
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        products: rows,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error",
        error: error.message,
        parameter: "page,limit"
      });
    } finally {
      if (isConnectionOpen) {
        connect.end();
      }
    }
  };
  


module.exports = {
    getAllProduct: getAllProduct,
    getFoodProduct: getFoodProduct,
    getDrinkProduct: getDrinkProduct,
    getCategoryName: getCategoryName,
    getAllProductPage: getAllProductPage
}