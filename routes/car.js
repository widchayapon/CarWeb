var express = require("express");
var router = express.Router();
const Car = require("../model/Cars");
const Brand = require("../model/brands");
const authenticateToken = require("../middleware/authenticateToken"); // นำเข้ามาใช้
const mongoose = require("mongoose");

// Middleware function to check if the user is an admin
function checkAdminRole(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next(); // If the user is an admin, proceed to the next middleware or route handler
  } else {
    return res.status(403).send({
      message: "⛔ Access denied. Admins only.",
      success: false,
    });
  }
}
router.post('/get', async function(req, res, next) {
  const brandId = req.body.brandId; 
  console.log(brandId)
  try {
    // Find cars that match the brand ID
    const cars = await Car.find({ brand: brandId }).select('name detail speed weight price image');
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Cars", error });
  }
});

router.get("/brand", async (req, res) => {
  const { brandId } = req.query;

  if (!brandId) {
    return res.status(400).json({ error: "Brand ID is required" });
  }

  try {
    // Fetch cars where the `brand` field matches the provided `brandId`
    const cars = await Car.find({
      brand: new mongoose.Types.ObjectId(brandId),
    });
    res.json(cars);
  } catch (error) {
    console.error("Failed to fetch cars:", error);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

// Create a new car
router.post("/", authenticateToken, checkAdminRole, async (req, res) => {
  try {
    const { name, detail, speed, weight, price, brandId ,image} = req.body;

    // Check if the brand exists
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    // Create the new car
    const newCar = new Car({
      name,
      detail,
      speed,
      weight,
      price,
      image,
      brand: brand._id,
    });

    // Save the car to the database
    await newCar.save();

    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ลบ user
router.delete("/:id", authenticateToken, checkAdminRole, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedId = await Car.findByIdAndDelete(id);

    if (!deletedId) {
      return res.status(404).json({
        message: "ID not found",
        success: false,
      });
    }

    return res.status(200).json({
      data: deletedId,
      message: "Deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message: "Delete failed",
      success: false,
    });
  }
});
module.exports = router;
