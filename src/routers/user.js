const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

//Create User
router.post("/users", async (req, res) => {
  try {
    const user = await new User(req.body);
    const token = await user.genAuth();
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Get User
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
  });

//Update The user
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowed = ["name", "email", "password", "age", "status", "phone"]
  
  const isAllowed = updates.every((update) => allowed.includes(update))
  
  if(!isAllowed){
    return res.status(400).send({error: "Invalid operation"})
  }

  try{
    const user = await User.findById(req.user._id)
    updates.forEach((update) => (user[update] = req.body[update]))
    await user.save()

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  }catch(e){
    res.status(500).send(e)
  }
})

//Login a User
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.genAuth();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// Logout a User
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Logout all users
router.post("/users/logoutAll",auth , async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Delete a user

router.delete("/users/me", auth, async (req, res) => {
  try{
    await req.user.remove()
    res.send(req.user)
  }catch(e){

  }
})

module.exports = router;
