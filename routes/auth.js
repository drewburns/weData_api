const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
require("../config/passport")(passport);
const User = require("../models").User;

router.post("/signup", function (req, res) {
  // console.log(req.body);
  if (!req.body.email || !req.body.password || !req.body.name) {
    res.status(400).json({ msg: "Please pass email and password." });
    return;
  } else {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => {
        const token = jwt.sign(
          JSON.parse(JSON.stringify(user)),
          "nodeauthsecret",
          { expiresIn: 86400 * 30 }
        );
        res.status(201).json({ user, token });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json(error);
      });
  }
});

router.post("/login", function (req, res) {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed. User not found.",
        });
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          user.password = "";
          var token = jwt.sign(
            JSON.parse(JSON.stringify(user)),
            "nodeauthsecret",
            { expiresIn: 86400 * 30 }
          );
          jwt.verify(token, "nodeauthsecret", function (err, data) {
            // console.log(err, data);
          });
          res.json({ token, user });
        } else {
          res.status(401).json({
            success: false,
            msg: "Authentication failed. Wrong password.",
          });
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

module.exports = router;
