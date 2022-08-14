const express = require('express');
const Router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utility/catch');
const passport =require('passport');


Router.get('/register',(req,res)=>
{
    res.render('user/reg-form');
})

Router.post('/register',wrapAsync(async (req,res)=>
{
     try{
        const {username,password,email} = req.body;
        const user =await new User({username,email});
        const registerUser =await User.register(user,password);
        req.login(registerUser,err=>
            {
                if(err){
                    return next(err);
                }
                req.flash('success','seccessfully registor !!!!');
                res.redirect('/Campground');
            })
     }
     catch(e){
        req.flash('danger',e.message)
        res.redirect('/register')
     }
}))

Router.get('/logout',(req,res)=>
{
    req.logout(()=>
    {
    });
    req.flash('success','logout');
    res.redirect('/Campground');
})

Router.get('/login',(req,res)=>
{
    res.render('user/login-form');
})

Router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'login'}),(req,res)=>
{
    req.flash('success','welcome :)');
    const url = req.session.path || '/Campground';
    res.redirect(url);
})


module.exports = Router;
