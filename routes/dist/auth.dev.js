"use strict";

var express = require("express");

var jwt = require("jsonwebtoken");

var passport = require("passport");

var router = express.Router();

require("../config/passport")(passport);

var User = require("../models").User;

router.post("/signup", function (req, res) {
  console.log(req.body);

  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      msg: "Please pass email and password."
    });
  } else {
    User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function (user) {
      var token = jwt.sign(JSON.parse(JSON.stringify(user)), "nodeauthsecret", {
        expiresIn: 86400 * 30
      });
      res.status(201).json({
        user: user,
        accessToken: token
      });
    }).catch(function (error) {
      console.log(error);
      res.status(400).json(error);
    });
  }
});
router.post("/login", function (req, res) {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (user) {
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed. User not found."
      });
    }

    user.comparePassword(req.body.password, function (err, isMatch) {
      if (isMatch && !err) {
        user.password = "";
        var token = jwt.sign(JSON.parse(JSON.stringify(user)), "nodeauthsecret", {
          expiresIn: 86400 * 30
        });
        jwt.verify(token, "nodeauthsecret", function (err, data) {// console.log(err, data);
        });
        res.json({
          token: token,
          user: user
        });
      } else {
        res.status(401).json({
          success: false,
          msg: "Authentication failed. Wrong password."
        });
      }
    });
  }).catch(function (error) {
    console.log(error);
    res.status(400).send(error);
  });
});
module.exports = router;