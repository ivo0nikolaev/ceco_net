const express = require("express");

require("./db/mangoose");

const Photo = require("./models/photo");
const userRouter = require('./routers/user')
const photoRouter = require('./routers/photo')

const app = express();
const port = process.env.PORT || 3000;

const router = new express.Router()
router.get('/test')

//It auto-parses json requests.

app.use(express.json());
app.use(userRouter)
app.use(photoRouter)

app.listen(port, () => {
  console.log("Server running on port " + port);
});
