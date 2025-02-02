const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',  // Secreto para el JWT
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            } else {
                console.error('User not found in JWT strategy');
                return done(null, false);
            }
        } catch (err) {
            console.error('Error in JWT strategy:', err);
            return done(err, false);
        }
    })
);

module.exports = passport;
