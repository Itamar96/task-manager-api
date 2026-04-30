//Import Express
let express = require('express');

//Run the database connection file
require('./db/mongoose');

//Load our environment variables
require('dotenv').config();

const path = require('path');

// Import routers
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

// Create an Express application
let app = express();

//Set server port
let port = process.env.PORT || 3000;

/*
    Express Middleware

    Client will require the authentication token, and the server will validate before performing other operations

    Express middleware will do the following

    //without middleware: new Request -> run route handler

    //with middleware: new request -> do something -> run route handler

    //something will be a function i.e. check for a valid authentication token or check / generate a server log

    //sign up and login won't require authentication in order for them to work
*/

//use app.use to use a middleware function
// app.use((req, res, next) => {
// //   console.log(req.method, req.path);
// //   next();
//     //if we wanted to shut down get requests, then do the following
//     if(req.method == 'GET'){
//         res.send('GET REQUESTS ARE DISABLED');
//     }
//     else{
//         next();
//     }
// })

//app.use to display maintenance message
// app.use((req,res,next)=>{
//     res.status(503).send('Site is currently down for maintenance')
// })

//Middleware to parse incoming JSON
app.use(express.json());

//Create a Router instance
// use the Router instance to call our routes

// let router = new express.Router();
// router.get('/test',(req,res)=>{
//     res.send('This is from my Router');
// })

app.use(express.static(path.join(__dirname, 'public')));


//Use Routers
app.use(userRouter);
app.use(taskRouter);



//Home path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','index.html'))
})

app.listen(port, () => {
    console.log('Server is live on the port: ' + port);
})




