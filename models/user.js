//defines User model
//What actually user document might look like

let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let validator = require('validator'); //to validate emails
let jwt = require('jsonwebtoken');

require('dotenv').config();

//create schema object
let userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
            if (value.includes('1234567')) {
                throw new Error('Password cannot contain "1234567"');
            }
        }
    },

    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

//INSTANCE METHOD → generate token for a user
userSchema.methods.generateAuthToken = async function () {

    let user = this;

    //generate token using environment variable
    let token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET
    );

    //store token inside user document
    user.tokens = user.tokens.concat({ token: token });

    //save user with new token
    await user.save();

    return token;
}

//STATIC METHOD → login user
userSchema.statics.findByCredentials = async (email, password) => {

    let user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

//MIDDLEWARE → hash password before saving
userSchema.pre('save', async function () {

    let user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
})

let User = mongoose.model('User', userSchema);

module.exports = User;