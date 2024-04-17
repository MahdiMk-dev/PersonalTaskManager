
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.signup = async (req, res) => {
    const { username, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            
            return res.status(400).json({ msg: 'User already exists' });
        }


        // Create new user
        user = new User({ username, password });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        return res.json({ msg: 'User created successfully' });
    }

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT token
        const SECRET_KEY="124hello123";
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            SECRET_KEY,
            { expiresIn: 3600 }, // 1 hour expiration
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
};
