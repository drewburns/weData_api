"use strict";

var JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt; // load up the user model


var User = require("../models").User;

module.exports = function (passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: "nodeauthsecret"
  };
  passport.use("jwt", new JwtStrategy(opts, function (jwt_payload, done) {
    User.findByPk(jwt_payload.id).then(function (user) {
      return done(null, user);
    }).catch(function (error) {
      return done(error, false);
    });
  }));
};