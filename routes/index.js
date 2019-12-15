var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { pagemessage: "Welcome to chat! Please log in" });
});

module.exports = router;
