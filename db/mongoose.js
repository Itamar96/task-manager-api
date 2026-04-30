//Connects to MongoDB Atlas

//Import mongoose library
let mongoose = require('mongoose');

//Load environment variable from the .env file
require('dotenv').config();

//Connect Mongoose to MongoDB Atlas using the connecting string
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    //If the connection is successful
    console.log('Connected to MongoDB Atlas');
})
.catch((error)=>{
    //If connection error happens
    console.log('Connection error', error.message)
})