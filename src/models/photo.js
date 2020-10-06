const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
   title: {
       type: String,
       validate(value){
           if(!value == ""){
               if(value.length > 64){
                    throw new Error("The title should be no more than 64 charters long")
               }
           }
       }
   },
   description: {
     type: String,
     validate(value){
        if(!value == ""){
            if(value.length > 240){
                 throw new Error("The title should be no more than 64 charters long")
            }
        }
     }  
   },
   owner: {
       type: mongoose.Schema.Types.ObjectId,
       require: true,
       ref: 'User'
   },
   body:{
    type: Buffer,
    // required: true
   }
},{
    timestamps : true
})

const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo

