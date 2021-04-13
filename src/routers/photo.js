const express = require("express")
const multer = require("multer")
const User = require("../models/user")

const Photo = require("../models/photo")
const auth = require("../middleware/auth")
const path = require("path")

const { Storage } = require("@google-cloud/storage")
const { createReadStream, createWriteStream } = require("fs")

const router = new express.Router()
const fs = require("fs")
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("JPG,JPEG or PNG only!"))
    }

    cb(undefined, true)
  },
})

const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    "../../web-security-310412-45d78a7f50b1.json"
  ),
  projectId: "web-security-310412",
})

// gc.getBuckets().then(x => console.log('x', x))

const bucket = gc.bucket("pictures_bucket_web_sec_2")

async function uploadFile(id, filename) {
  var re = /(?:\.([^.]+))?$/
  var ext = re.exec(filename)[1]; 
  await bucket.upload(`${__dirname}/temp/${filename}`, {
    destination: `${id}.${ext}`,
  })

}

//Upload a photo
//TODO - Consider refactoring
router.post("/photos", auth, upload.single("photo"), async (req, res) => {
  fs.writeFile(
    `${__dirname}/temp/${req.file.originalname}`,
    req.file.buffer,
    "binary",
    function (err) {
      if (err) throw err
    }
  )
  try {
    //Scope
    let body
    try {
      // no file provided error
      console.log(req.file)
      body = req.file.buffer
    } catch (e) {
      res.status(500).send("You must provide a photo file")
    }
    const title = req.body.title
    let visibility
    if (req.body.visibility) {
      visibility = req.body.visibility === "true"
    }
    const description = req.body.description
    const owner = req.user._id
    const photo = await new Photo({
      title,
      visibility,
      description,
      owner,
      body,
    })
    uploadFile(photo.id, req.file.originalname)
    // await new Promise(res => createReadStream()
    // .pipe(createWriteStream)
    // )
    //   createReadStream()
    //   .pipe(
    //     bucket.file(photo.id).createWriteStream({
    //       resumable: false,
    //       gzip: true
    //     })
    //   )

    await photo.save()
    res.status(201).send(photo._id)
  } catch (e) {
    console.log("failed", e)
    await res.status(500).send(e)
  }
})

router.get("/photos/:id", auth, async (req, res) => {
  try {
    const photo = await Photo.find({ owner: req.params.id })
    if (photo.length) {
      const imageName = photo[Math.floor(Math.random() * (photo.length - 1))]._id
      res.send(imageName)
    }
    res.send('no image')
  } catch (e) {
    console.log("errorrr", e)
    res.status(404).send()
  }
})

//Delete a photo

router.delete("/photos/:id", auth, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id)
    if (!photo) {
      return res.status(404).send()
    }
    res.send()
  } catch (e) {}
})
module.exports = router
