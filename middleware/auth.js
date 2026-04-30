let jwt = require('jsonwebtoken');
let User = require('../models/user');

require('dotenv').config();

//AUTH MIDDLEWARE → verify user token
let authenticate = async (req, res, next) => {

    try {

        //get token from header
        let token = req.header('Authorization').replace('Bearer ', '');

        //verify token using env variable
        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find user with matching token
        let user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });

        if (!user) {
            throw new Error();
        }

        //attach user + token to request
        req.token = token;
        req.user = user;

        next();

    } catch (error) {
        res.status(401).send({ error: 'Please authenticate the user' });
    }
}

module.exports = authenticate;