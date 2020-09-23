const mongoose = require("mongoose");
const validator = require("validator")



const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not a valid email')
            }
        }
    },
    age:{
        type: Number,
        default: 0,
        required: true,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length < 8){
                throw new Error('The password sould be at least 8 characters long')
            }
            if(value === "password"){
                throw new Error('The password cannot be "password"!')
            }
        }
    }
})

module.exports = User