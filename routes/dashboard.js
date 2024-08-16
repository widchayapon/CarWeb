var express = require('express');
var router = express.Router();
const User = require('../model/Users');
const authenticateToken = require('../middleware/authenticateToken'); // นำเข้ามาใช้
const Brand = require("../model/brands"); // โมเดลที่นำเข้า
const Car = require("../model/Cars");


// ดึง user ทั้งหมด
router.get('/users', authenticateToken, async function(req, res, next) {
    try {
        let user = await User.find();
        return res.status(200).send({
            data: user,
            message: 'Success',
            success: true
        });
    } catch { 
        return res.status(500).send({
            message: "Server Error",
            success: false
        });
    }
});
router.get('/user', authenticateToken, async function(req, res, next) {
    try {
        let user = await User.findById(req.user.id); 
        if (!user) {
            return res.status(404).send({
                message: 'User not found',
                success: false
            });
        }
        return res.status(200).send({
            userId:user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            message: 'Success',
            success: true
        });
    } catch { 
        return res.status(500).send({
            message: "Server Error",
            success: false
        });
    }
});
router.get('/dashboard', async function(req, res, next) {
    try {
        let users = await User.find();
        let brands = await Brand.find();
        let cars = await Car.find().populate('brand').catch(error => {
            console.error("Error populating brand:", error);
            throw error;
        });
        let userCount = await User.countDocuments();
        let brandCount = await Brand.countDocuments();
        let carCount = await Car.countDocuments();

        // Calculate the number of cars for each brand
        let brandCarCounts = await Promise.all(brands.map(async (brand) => {
            let count = await Car.countDocuments({ brand: brand._id });
            return {
                brandName: brand.name,
                carCount: count
            };
        }));

        return res.status(200).send({
            data: {
                List_users: users,
                List_brands: brands,
                List_cars: cars,
                userCount: userCount,
                brandCount: brandCount,
                carCount: carCount,
                brandCarCounts: brandCarCounts  
            },
            message: 'Success',
            success: true
        });
    } catch (error) { 
        return res.status(500).send({
            message: "Server Error",
            success: false,
            error: error.message
        });
    }
});




module.exports = router;
