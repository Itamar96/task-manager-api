//Import mongoose so we can create a model
let mongoose = require('mongoose');

//Define Task model
let Task = mongoose.model('Task', {
    
    //title field
    title: {
            type: String,
            required: true,
            trim: true  //Remove extra spaces from the beginning and end
    },

    //completed field
    completed: {
        type: Boolean,  //Value must be true or false
        default: false
    }

})

module.exports = Task;