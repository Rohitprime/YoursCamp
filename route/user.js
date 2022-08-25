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
                req.flash('success',`Welcome to Yours Camp   :)`);
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
    req.logout(()=>{});
    req.flash('warning',` Your are logout`);
    res.redirect('/Campground');
})

Router.get('/login',(req,res)=>
{
    let obj="Yours_Camp";
    let code="success"
    res.render('user/login-form',{obj,code});
})

// || '/Campground';
Router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),(req,res)=>
{
    const url = req.session.backTo || '/Campground';
    console.log("from post " ,req.session.backTo)
    req.flash('success','Welcome back :)');
    res.redirect(url);
})


module.exports = Router;
