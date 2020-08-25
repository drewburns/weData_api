"use strict";

var express = require('express');

var jwt = require('jsonwebtoken');

var passport = require('passport');

var router = express.Router();

require('../config/passport')(passport);

var User = require('../models').User;
/* GET users listing. */


router.get('/', function (req, res, next) {
  res.json("HI");
});
module.exports = router;