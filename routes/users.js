const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const User = require('../models').User;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json("HI");
});

module.exports = router;
