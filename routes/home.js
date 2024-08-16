var express = require('express');
var router = express.Router();
const User = require('../model/Users');
const jwt = require('jsonwebtoken');
// Password strength validation
function isStrongPassword(password) {
    const minLength = 3;
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return password.length >= minLength && regex.test(password);
}

// Email format validation
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username) {
            return res.status(400).send({
                message: 'Username is required',
                success: false,
            });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).send({
                message: 'Username must be between 3 and 20 characters',
                success: false,
            });
        }

        if (!password) {
            return res.status(400).send({
                message: 'Password is required',
                success: false,
            });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).send({
                message: 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character',
                success: false,
            });
        }

        if (!email) {
            return res.status(400).send({
                message: 'Email is required',
                success: false,
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({
                message: 'Email format is invalid',
                success: false,
            });
        }

        let existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).send({
                message: 'Username already exists',
                success: false,
            });
        }

        existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({
                message: 'Email already exists',
                success: false,
            });
        }

        let newUser = new User({
            username: username,
            password: password,
            email: email,
        });

        let user = await newUser.save();
        return res.status(201).send({
            data: user,
            message: 'Create Success',
            success: true,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send({
            message: 'Create Fail',
            success: false,
        });
    }
});
// สำหรับ login
router.post('/login', async function(req, res, next) {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                message: '⛔ email and password are required',
                success: false
            });
        }
        const user = await User.findOne({ email });

        if (!user) {  // เปลี่ยนจาก if (!email) เป็น if (!user)
            return res.status(404).send({
                message: '⛔ email not found',
                success: false
            });
        }
        if (password !== user.password) {
            return res.status(401).send({
                message: '⛔ Invalid password',
                success: false
            });
        }
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, 'P@ssw0rd', { expiresIn: '1h' });
        return res.status(200).send({  
            data: {
                username: user.username, 
                role: user.role,
                token: token
            },
            message: `✅ Welcome ${user.username}`,
            success: true
        });
    } catch (error) {
        return res.status(500).send({
            message: '⛔ Login fail',
            success: false
        });
    }
});

module.exports = router;
