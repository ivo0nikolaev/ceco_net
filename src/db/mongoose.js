const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ceco-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});