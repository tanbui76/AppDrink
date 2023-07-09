import express from 'express';
import initAPIRoutes from './route/api';
import bodyParser from 'body-parser';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport session setup. 
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Sử dụng FacebookStrategy cùng Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret: config.facebook_api_secret,
    callbackURL: config.callback_url
},
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(accessToken, refreshToken, profile, done);
            return done(null, profile);
        });
    }
));

initAPIRoutes(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
