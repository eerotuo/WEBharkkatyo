const mongoose = require("mongoose");

const CommentsShema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  originalposttid: mongoose.Schema.Types.ObjectId,
  testi: String,
  name: String,
  post: String
});

module.exports = mongoose.model("Comments", CommentsShema);
