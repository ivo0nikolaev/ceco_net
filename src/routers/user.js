const express = require('express')
const User = require("../models/user");
const auth = require("../middleware/auth")

const router = new express.Router()

//Create User
router.post('/users', async (req, res) => {
    try {
        const user = await new User(req.body)
        const token = await user.genAuth();
        await user.save()
        res.status(201).send({user, token})
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

//Login in User
router.post('/users/login', async (req, res) =>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.genAuth()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

module.exports = router