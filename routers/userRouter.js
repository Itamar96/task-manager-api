let express = require('express');
require('dotenv').config();

let User = require('../models/user');
let authenticate = require('../middleware/auth');

let router = new express.Router();

//SIGNUP
router.post('/users', async (req, res) => {

    let user = new User(req.body);

    try {

        //save user first
        await user.save();

        //then generate token
        let token = await user.generateAuthToken();

        res.status(201).send({ user, token });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).send({ error: 'Email already exists' });
        }

        res.status(400).send({ error: error.message });
    }
});

//LOGIN
router.post('/users/login', async (req, res) => {

    try {

        let user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        let token = await user.generateAuthToken();

        res.status(200).send({ user, token });

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//WHO AM I
router.get('/users/me', authenticate, async (req, res) => {
    res.send(req.user);
});

//LOGOUT
router.post('/users/logout', authenticate, async (req, res) => {

    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();

        res.send();

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//LOGOUT ALL
router.post('/users/logoutAll', authenticate, async (req, res) => {

    try {

        req.user.tokens = [];

        await req.user.save();

        res.send();

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;