var express = require('express');
var router = express.Router();
const brand = require("../model/brands"); // โมเดลที่นำเข้า
const authenticateToken = require("../middleware/authenticateToken"); // นำเข้ามาใช้

// Middleware function to check if the user is an admin
function checkAdminRole(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next(); // If the user is an admin, proceed to the next middleware or route handler
    } else {
        return res.status(403).send({
            message: '⛔ Access denied. Admins only.',
            success: false
        });
    }
}
router.get('/brands', async function(req, res, next) {
    try {
        const brands = await brand.find();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: "Error fetching brands", error });
    }
});
router.get('/getbrand', async function(req, res, next) {
    try {
        const brands = await brand.find().select('name detail created_at');
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: "Error fetching brands", error });
    }
});

router.post('/', authenticateToken, checkAdminRole, async function(req, res, next) {
    try {
        let { name, image, detail } = req.body;

        // ตรวจสอบว่าทุกฟิลด์มีค่าหรือไม่
        if (!name || !image || !detail) {
            return res.status(400).send({
                message: "⛔ Missing required fields",
                success: false
            });
        }

        // ตรวจสอบความยาวของชื่อหรือเงื่อนไขเพิ่มเติมอื่นๆ (ถ้ามี)
        if (name.length < 3) {
            return res.status(400).send({
                message: "⛔ Name must be at least 3 characters long",
                success: false
            });
        }

        // ใช้โมเดล `brand` ในการสร้างข้อมูลใหม่
        let newBrand = new brand({
            name,
            image,
            detail
        });

        let savedBrand = await newBrand.save();
        return res.status(201).send({
            data: savedBrand,
            message: "✅ Create Success",
            success: true
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({
                message: `⛔ Validation Error: ${error.message}`,
                success: false
            });
        }

        // ตรวจสอบข้อผิดพลาดอื่นๆ เช่นการเชื่อมต่อฐานข้อมูล
        return res.status(500).send({
            message: "⛔ Internal Server Error",
            success: false
        });
    }
});
router.delete('/:id', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const id = req.params.id;
        const deletedId = await brand.findByIdAndDelete(id);

        if (!deletedId) {
            return res.status(404).json({
                message: 'ID not found',
                success: false
            });
        }

        return res.status(200).json({
            data: deletedId,
            message: 'Deleted successfully',
            success: true
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            message: 'Delete failed',
            success: false
        });
    }
});
module.exports = router;
