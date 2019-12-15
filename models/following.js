const mongoose = require("mongoose");

const FollowingShema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  follower: String,
  following: String
});

module.exports = mongoose.model("Follow", FollowingShema);
