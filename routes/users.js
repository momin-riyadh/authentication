const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/register', async function (req, res, next) {
    // const {email, password} = req.body;
    try {

        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
            const newUser = new User({
                email: req.body.email,
                password: hash,
            });
            await newUser.save();
            res.status(201).json(newUser);
        });


    } catch (error) {
        res.status(500).json(error.message);
    }
});


router.post('/login', async function (req, res, next) {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        // Load hash from your password DB.

        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    res.status(200).json({status: 'valid user'})
                }
            });

        } else {
            res.status(404).json({status: 'Not valid user'})
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
});

module.exports = router;
