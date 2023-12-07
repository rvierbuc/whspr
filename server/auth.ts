import Passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2'
require('dotenv').config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ENVIRONMENT } = process.env;

const callbackURL = 'http://localhost:3000/google/callback';

Passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL,
        passReqToCallback: true
    },
    (accessToken, refreshToken, profile, done) => {
        console.log('profile', profile);
        return done(null, profile);
    }
))

Passport.serializeUser((user: any, done) => {
    done(null, user);
});

Passport.deserializeUser((user: any, done) => {
    done(null, user);
});