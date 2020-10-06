const express = require("express");
const multer = require("multer");

const Photo = require("../models/photo");
const auth = require("../middleware/auth");

const router = new express.Router();

const upload = multer({
    limits: {
        fileSize: 1000000
      },
      fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
          return cb(new Error('JPG,JPEG or PNG only!'))
        }
    
        cb(undefined, true)
      }
});

//Upload a photo
//TODO - Consider refactoring
router.post("/photo", auth,upload.single("photo"),async (req, res) => {
    try {
        //Scope
        let body
      try {
        // no file provided error
        body = req.file.buffer;
      } catch (e) {
        res.status(500).send("You must provide a photo file");
      }
      const title = req.body.title;
      const description = req.body.description;
      const owner = req.user._id;
      const photo = await new Photo({ title, description, owner, body });
      await photo.save();
      res.send();
    } catch (e) {
      await res.status(500).send(e);
    }
  }
);

module.exports = router;
