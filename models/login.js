const mongoose = require("mongoose");

const LoginShema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String
});

module.exports = mongoose.model("Login", LoginShema);
