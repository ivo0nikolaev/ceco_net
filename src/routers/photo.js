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
router.post("/photos", auth,upload.single("photo"),async (req, res) => {
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
      let visibility
      if(req.body.visibility){
         visibility = req.body.visibility === 'true'
      }
      const description = req.body.description;
      const owner = req.user._id;
      const photo = await new Photo({ title, visibility, description, owner, body });
      await photo.save();
      res.status(201).send();
    } catch (e) {
      await res.status(500).send(e);
    }
  }
);

router.get("/photos/:id", auth, async (req, res) => {
    try{
        const photo = await Photo.findOne({ _id: req.params.id})
        const isOwner = req.user.id === photo.owner
        if(!photo.visibility){
            if(!isOwner){
            throw new Error()
            }
        }
        res.set('Content-Type', 'image/jpg')
        res.send(photo.body)
    }catch(e){
        console.log(e)
        res.status(404).send()
    }
})

//Delete a photo

router.delete('/photos/:id', auth, async (req, res) => {
  try{
    const photo = await Photo.findByIdAndDelete(req.params.id)
    if(!photo){
      return res.status(404).send();
    }
    res.send()
  }catch(e){

  }
})
module.exports = router;
