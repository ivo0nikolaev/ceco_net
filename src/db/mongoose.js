const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://root:root@cluster0.z8rrz.mongodb.net/Cluster0?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});