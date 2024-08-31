const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({
            username,
            email,
            password
        });
        await newUser.save();
        res.status(201).redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login User
exports.loginUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            req.session.userId = user._id;
            res.redirect('/projects');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.redirect('/login');
    }
};

// Logout User
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
