const express = require('express')
const User = require("../models/user");
const auth = require("../middleware/auth")

const router = new express.Router()

router.post('/users', async (req, res) => {
    try {
        const user = await new User(req.body)
        const token = await user.genAuth();
        await user.save()
        res.send({user, token})
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router