const mongoose = require("mongoose");

const UserShcema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  Strinid: String,
  name: String,
  post: String
});

module.exports = mongoose.model("User", UserShcema);
