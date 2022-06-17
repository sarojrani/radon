const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobile: {
        type: String,
        unique: true,
        required: true
    },
    emailId: String,
    password: String,
    gender: {
        type: String,
        enum: ["male", "female", "LGBTQ"] 
    },
    age: Number,
    isDelete: {
        type : Boolean,
        default:true
    },
    posts: {
        type: [],
        deafult: []
        }

    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema) 