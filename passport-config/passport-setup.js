const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user-model');

require('dotenv').config();

const Client_id = process.env.GOOGLE_CLIENT_ID;
const Client_secret = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser(function(user,done){
    done(null,user.id);
})

passport.deserializeUser(function(id,done){
    User.findById(id).then(function(user){
        done(null,user);
    });
})

passport.use(
    new GoogleStrategy({
        callbackURL : '/auth/google/redirect', 
        clientID : Client_id,
        clientSecret : Client_secret
    },function(accessToken,refreshToken,profile,done){
        //check if user already exists
        User.findOne({email : profile._json.email}).then(function(currentUser){
            if(currentUser){
                // console.log('already have the user');
                //already have user
                done(null,currentUser);
            }else{
                // create a user
                User.create({
                    username : profile._json.name,
                    email : profile._json.email,
                    image : profile._json.picture
                }).then(function(newUser){
                    console.log('New user is created');
                    done(null,newUser);
                });
                
            }
        })
        // console.log(profile._json);
    })
)