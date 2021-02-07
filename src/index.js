const express = require("express")

const http = require("http")


const mongoose = require("mongoose")
const cors = require("cors")

mongoose.connect("mongodb://localhost:27017/ceco-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
})

const Photo = require("./models/photo")
const userRouter = require("./routers/user")
const photoRouter = require("./routers/photo")

const app = express()
const port = process.env.PORT || 3001

const server = http.createServer(app)
// const io = socketIo(server)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
let interval

io.on("connection", (socket) => {
  console.log("New client connected")
  const id = socket.handshake.query.id
  socket.join(id)
  socket.on('send-message', ({ recipients, text }) => {
    console.log('sending message', recipients, text)
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)

      console.log('sendiong message to ', recipient, text)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
  // if (interval) {
  //   clearInterval(interval)
  // }
  // interval = setInterval(() => getApiAndEmit(socket), 1000)
  // socket.on("disconnect", () => {
  //   console.log("Client disconnected")
  //   clearInterval(interval)
  // })
})

const getApiAndEmit = (socket) => {
  const response = new Date()
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response)
}

server.listen(3002, () => console.log(`Listening on port ${3002}`))

const router = new express.Router()
app.use(
  cors({
    origin: "http://localhost:3000",
  })
)
app.get("/test", (req, res) => {
  res.send("Cec-Net will send Mr. Roboto to kill Sarah Conor")
})

//It auto-parses json requests.

app.use(express.json())
app.use(userRouter)
app.use(photoRouter)

app.listen(port, () => {
  console.log("Cec Net has become self aware on port: " + port)
})
