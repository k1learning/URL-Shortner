const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth-routes');
const accessRoutes = require('./routes/access-routes');
const passportSetup = require('./passport-config/passport-setup');
const shortUrl = require('./models/shortUrl');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const cookieKey = process.env.COOKIE_KEY;
const mongoServer = process.env.MONGO_URI;

const app = express();

// set up view engine
app.set('view engine' , 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(cookieSession({
    maxAge : 24*60*60*1000,
    resave: false,
    saveUninitialized: true,
    keys : [cookieKey]
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());


//connect to mongodb
mongoose.connect(mongoServer, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//setup Routes
app.use('/auth',authRoutes);
app.use('/access',accessRoutes);

//create home route
app.get('/',async function(req,res){
    try {
        const shortUrls = await shortUrl.find({ email: { $exists: false } });
        res.render('home', { shortUrls : shortUrls });
      } catch (error) {
        console.error('Error retrieving short URLs:', error);
        res.status(500).send('Error retrieving short URLs');
      }
})

app.listen(PORT,function(){
    console.log('Server is up and running!');
});

