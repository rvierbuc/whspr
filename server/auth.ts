import { User } from "./dbmodels";

require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ENVIRONMENT } = process.env;
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'
const callbackURL = `http://${HOST}:${PORT}/google/callback`;
console.log('callbackURL')
passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL,
        passReqToCallback: true
    },
    (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        // console.log('profile', profile);
        User.findOrCreate({
            where: { googleId: profile.id },
            defaults: {
                username: profile.displayName,
                profileImgUrl: profile.picture
            }
        });
        return done(null, profile);
    }
))

passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});