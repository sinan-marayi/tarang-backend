const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("../config/database");

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secretKey;
  passport.use(
    new JwtStrategy(opts,(jwt_payload, done) => {
      console.log(jwt_payload);
      User.findOne(jwt_payload.sub,(err,user) => {
        if (err) done(err, false);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
