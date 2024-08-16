var express = require("express");
var router = express.Router();
const User = require("../model/Users");
const authenticateToken = require("../middleware/authenticateToken"); // นำเข้ามาใช้

// Email format validation
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
router.put("/edit/:id", authenticateToken, async function (req, res, next) {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).send({
        message: "Email format is invalid",
        success: false,
      });
    }

    // Check if the username already exists (excluding the current user)
    let existingUser = await User.findOne({ username: username });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).send({
        message: "Username already exists",
        success: false,
      });
    }

    // Check if the email already exists (excluding the current user)
    existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).send({
        message: "Email already exists",
        success: false,
      });
    }

    // Update the user only after all checks
    const updatedUser = await User.findByIdAndUpdate(userId, { username, email });

    return res.status(200).send({
      data: updatedUser,
      message: "✅ User updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "⛔ Failed to update user",
      success: false,
    });
  }
});

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

router.delete('/:id', authenticateToken, checkAdminRole, async function(req, res, next) {
  try {
      const id = req.params.id;
      const deletedid = await User.findByIdAndDelete(id);

      if (!deletedid) {
          return res.status(404).send({
              message: '⛔ ID not found',
              success: false
          });
      }

      return res.status(200).send({
          data: deletedid,
          message: '✅ Deleted success',
          success: true
      });
  } catch (error) {
      return res.status(500).send({
          message: '⛔ Delete Fail',
          success: false
      });
  }
});


module.exports = router;
