if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}

const dbUrl=process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./utility/expressError');
const campgroundroute = require('./route/campground');
const reviewroute = require('./route/review');
const flash = require('connect-flash');
const userroute = require('./route/user');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require("connect-mongo");

const app = express();
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


// to parse the request body
app.use(express.urlencoded({extended:true}));

//to fake the http request like put delete 
app.use(methodOverride('_method'));

const secret = process.env.CLOUDINARY_SECRET || 'rohitprime'
app.use(express.static(path.join(__dirname,'public')))

const store = MongoStore.create({
    mongoUrl:dbUrl,
    secret,
    touchAfter:24*60*60
})

store.on("error",(e)=>{
    console.log("session",e)
})

const sessionOption = {
             
              store,
              secret,
              resave:false,
              saveUninitialized:true,
              cookie:{
                httpOnly:true,
                expires:Date.now()+1000*60*60*24*7
              },
              store:MongoStore.create({
                mongoUrl: 'mongodb://localhost:27017/yelp-camp'
              })
             

}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ----> 

app.use((req,res,next)=>
{
 res.locals.user = req.user;
 res.locals.success = req.flash('success');
 res.locals.danger = req.flash('danger');
 res.locals.warning = req.flash('warning');
   next();
})

    //  ---->  starts all routes

app.get('/',(req,res)=>
{
    res.render('head.ejs');
})

    // ---->  all routers

    app.use('/Campground',campgroundroute);
    app.use('/Campground/:id/review',reviewroute); 
    app.use('/',userroute);

//  ----> custom error hadler

   app.get('*',(req,res,next)=>
   {
       res.render('campground/error.ejs')
   })

 
//    "mongodb://localhost:27017/yelp-camp"
  
mongoose.connect(dbUrl)
.then(() =>
{
    console.log('connected good to go');
})
.catch((err) =>
{
    console.log('connection failed!!!!!');
    console.log(err);
});
 
const port = process.env.PORT || 3000;
app.listen(port ,()=>
{
    console.log(`listing... on ${port}`);
})