const express = require("express");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ceco-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});

const Photo = require("./models/photo");
const userRouter = require('./routers/user')
const photoRouter = require('./routers/photo')

const app = express();
const port = process.env.PORT || 3000;

const router = new express.Router()

app.get('/test', (req, res) =>{
  res.send('Cec-Net will send a Mr. Roboto to kill Sarah Conor')
})

//It auto-parses json requests.

app.use(express.json());
app.use(userRouter)
app.use(photoRouter)

app.listen(port, () => {
  console.log("Cec Net has become self aware on port: " + port);
});
