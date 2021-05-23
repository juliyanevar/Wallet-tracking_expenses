const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: '657430627711-2jecito4q3fnm7po6cuajcl55kgcro3n.apps.googleusercontent.com',
            clientSecret: 'DLe3zdWDskC1xGJFfye2XHaG',
            //callbackURL: "https://rocky-castle-38495.herokuapp.com/auth/google/callback",
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    )
);
