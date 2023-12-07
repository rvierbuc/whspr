require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ENVIRONMENT } = process.env;

const callbackURL = 'http://localhost:3000/google/callback';

passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL,
        passReqToCallback: true
    },
    (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        return done(null, profile);
    }
))

passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});