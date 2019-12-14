// Required libraries
var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

// Get the db instance
var Posts = require("../models/models");
var Comments = require("../models/comments");

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

// Get posts listing
router.get("/", function(req, res, next) {
  Posts.find({}, function(err, data) {
    if (err) throw err;
    Comments.find({}, function(err, data2) {
      if (err) throw err;
      res.render("posts", {
        title: "Post List",
        post_list: data,
        comment_list: data2
      });
    });
  });

  //Above is example of ES6 function def; it is functionally similar to the then function
});

// Sanitation middleware
// See https://express-validator.github.io/docs/sanitization-chain-api.html
// And https://express-validator.github.io/docs/filter-api.html
router.post(
  "/create",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    const product = new Posts({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.author,
      post: req.body.content
    });
    product
      .save()
      .then(result => {
        console.log(result);
        res.redirect("/posts");
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
);

router.post(
  "/comment/:id",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    console.log("--------------------------" + req.params.id);
    const comment = new Comments({
      _id: new mongoose.Types.ObjectId(),
      originalposttid: req.params.id,
      name: req.body.author,
      post: req.body.content
    });
    comment
      .save()
      .then(result => {
        console.log(result);
        res.redirect("/posts");
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
);

module.exports = router;
