import express from 'express';
import initAPIRoutes from './route/api';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import googlekeys from './config/configGG';
import getConnection from './config/connectDB';
// import GooglePassport from './route/passport';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

passport.use(
    new GoogleStrategy({
        clientID: googlekeys.googleClientID,
        clientSecret: googlekeys.googleClientSecret,
        callbackURL: googlekeys.callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            if (profile.id) {
                console.log(profile);
                const [rows] = await (await getConnection()).execute("SELECT * FROM user WHERE googleId = ?", [profile.id]);
                if (rows.length > 0) {
                    return res.status(200).json({
                        message: "Login with google success",
                        data: rows
                    });
                } else {
                    let googleId = profile.id;
                    let name = profile.displayName;
                    let email = profile.emails[0].value;
                    const [rows] = await (await getConnection()).execute("INSERT INTO user (google_id, full_name, email) VALUES (?, ?, ?)", [googleId, name, email]);
                    return res.status(200).json({
                        message: "Login with google success",
                        data: rows
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    })
);

initAPIRoutes(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
