// Required libraries
var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

// Get the db instance
var Posts = require("../models/models");
var Comments = require("../models/comments");
var Logindata = require("../models/login");
var Follow = require("../models/following");

var personLogged;

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

// Get posts listing
router.get("/", function(req, res, next) {
  Posts.find({}, function(err, posts) {
    if (err) throw err;
    Comments.find({}, function(err, comments) {
      if (err) throw err;
      Follow.find({}, function(err, follower) {
        if (err) throw err;
        console.log(personLogged);
        res.render("posts", {
          title: "SuperChat",
          post_list: posts,
          comment_list: comments,
          follow_list: follower,
          personLogged: personLogged
        });
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
    const tempid = new mongoose.Types.ObjectId();
    const strinid = tempid.toString();
    const product = new Posts({
      _id: tempid,
      Strinid: strinid,
      name: personLogged,
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
      name: personLogged,
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

router.post(
  "/follow",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    const follow = new Follow({
      _id: new mongoose.Types.ObjectId(),
      follower: personLogged,
      following: req.body.following
    });
    follow
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

router.post("/unfollow/:id", function(req, res) {
  var id = req.params.id;

  Follow.findOneAndRemove({ _id: id }, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }

    res.redirect("/posts");
    return res.status(200).send();
  });
});

///////////////////////////////////////////////////
//Function to handle login and creation of new user

router.post(
  "/lognew",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    //const tempid = new mongoose.Types.ObjectId();
    //const strinid = tempid.toString();
    const log = new Logindata({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.user,
      password: req.body.password
    });
    log
      .save()
      .then(result => {
        console.log(result);
        res.render("index", { pagemessage: "Käyttäjä lisätty onnistuneesti" });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
);

router.post("/logout", function(req, res, next) {
  personLogged = "";
  res.render("index", { pagemessage: "Failed login. Please ty again." });
});

router.post("/login", function(req, res, next) {
  const userr = req.body.user;
  const paswrt = req.body.password;
  var allow = false;
  var i = 0;
  Logindata.find({}, function(err, login) {
    console.log(login);
    if (err) throw err;
    for (var i = 0; i < login.length; i++) {
      if (userr === login[i].username && paswrt === login[i].password) {
        personLogged = userr;
        console.log(personLogged);
        allow = true;
        console.log("täsmää");
      } else {
        console.log("ei täsmää");
        //res.render("index", { pagemessage: "Väärä tunnus" });
      }
    }

    if (allow) {
      res.redirect("/posts");
    } else {
      res.render("index", { pagemessage: "Failed login. Please ty again." });
    }
  });

  //Above is example of ES6 function def; it is functionally similar to the then function
});

module.exports = router;
