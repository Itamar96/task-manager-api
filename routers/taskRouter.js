//Import Express
let express = require('express');

//Import model
let Task = require('../models/task');

//Create a new router
let router = new express.Router();

//TASK ROUTES

//USER ROUTES
/*
POST  /tasks   //creating task
GET   /tasks    //Reading all the tasks
GET   /tasks/:id  //Reading a single task
PATCH /tasks/:id  //Update a single task
DELETE /tasks/:id  //Delete a task
*/
//CREATE TASK
router.post('/tasks', async (req, res) => {

    //Create a new task from JSON body sent by Postman
    let task = new Task(req.body);

    try {

        await task.save();

        //Send created user with a status of 201
        res.status(201).send(task);
    }
    catch (error) {
        res.status(400).send(error.message)
    }
})

//GET ALL TASKS
router.get('/tasks', async (req, res) => {
    try {

        //Find all the task documents from Task collection
        let tasks = await Task.find({});

        //Send them back as JSON
        res.send(tasks);

    }
    catch (error) {
        res.status(500).send(error.message);
    }
})

// GET A TASK BY ID
router.get('/tasks/:id', async (req, res) => {

    //Extract id from route parameter
    let id = req.params.id;
    try {

        //Find one task by id
        let task = await Task.findById(id);

        //If user does not exists, send a response of 404
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.send(task);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
})

// UPDATE A TASK BY ID
router.patch('/tasks/:id', async (req, res) => {

    //Extract fields that user is trying to update
    const updates = Object.keys(req.body);

    // Fields allowed to be updated
    const allowedUpdates = ['title','completed'];


    //Check if every field in a request is allowed
    const isValidOperation = updates.every(field => allowedUpdates.includes(field));

    //If user tries to update _id or __v or any invalid field
    if(!isValidOperation) {
        return res.status(400).send("Invalid updates! You cannot update _id or __v");
    }

    try{

        // Find user by ID and update the document
        const task = await Task.findByIdAndUpdate(
            req.params.id,    //Which user wants to update
            req.body,         //What to update
            {
                returnDocument: 'after',    //Return updated document
                runValidators: true   //Apply model validations
            }
        )
        //If the user was not found
        if(!task){
            return res.status(404).send('Task not found');
        }
        //Send the updated user
        res.send(task);


    }
    catch(error){
        res.status(400).send(error.message);
    }



})

//DELETE TASK BY ID
router.delete('/tasks/:id', async (req, res) => {

    try{
        //Find the user by ID and delete the user
        const task = await Task.findByIdAndDelete(req.params.id);

        //IF the task id not found
        if(!Task){
            return res.status(404).send('Task not found');
        }

        //Send deleted User
        res.send(task);
    }
    catch(error){
        res.status(500).send(error.message);
    }

})

module.exports = router;