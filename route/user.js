const express = require('express');
const Router = express.Router();
const User = require('../models/user');
const Campground = require('../models/campground');
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
    let obj="YoursCamp";
    let code="success"
    res.render('user/login-form',{obj,code});
})

Router.post('/login',passport.authenticate('local',{ failureRedirect:'/login', failureFlash: true}),async (req,res)=>
{
    const url = req.session.backTo || '/Campground';
    req.flash('success','Welcome back :)');

    if(req.user.role=="admin"){    
        res.redirect('/adminPage');
    }
    else if(req.user.role=="subAdmin"){
         res.redirect('/subAdminPage');
    }
    else{
        res.redirect(url);
    }
})


///// -----> Admin route

Router.get('/adminPage',async (req,res)=>{
    if(!req.user){
        res.redirect('/login')
    }
   else if(req.user.role=="admin"){
        const users = await User.find({});

    
      res.render('admin/admin',{users});

  }
  else {
    req.flash('danger',"You Are Not An Admin");
    res.redirect("/Campground")
  }
})

Router.post('/changeRole/:id',async (req,res)=>{
   const id = req.params.id;
   const role = req.body.role;
   const user = await User.findById(id);
 
   user.role = role;
   await user.save();
 
   req.flash('success',`Role Of User -- ${user.username} -- Has Been Changed To ${role}`);

   res.redirect("/adminPage");

})

//  ----> subAdmin route


Router.get('/subAdminPage',async (req,res)=>{
    if(!req.user){
        res.redirect('/login')
    }
   else if(req.user.role=="subAdmin"){
        
     const camps = await Campground.find({}).populate('author') 
     .populate({path:'reviews',
            populate:{
            path:'author'
        }});
     let camp = null;
       for(let campin of camps){
        if(campin.author.id==req.user.id){
          camp = campin;
        }
       }
      res.render('admin/subAdmin',{camp});
  }
  else {
    req.flash('danger',"You Are Not A SubAdmin");
    res.redirect("/Campground")
  }

})

Router.post('/addReviewers/:id',async (req,res)=>
{
    const {id} = req.params;
  

        const camp = await Campground.findById(id);  
    
        camp.reviewers.push(req.body.email);
        await camp.save();
        req.flash('success','New Reviewer Has Added')
        res.redirect('/subAdminPage');

    })




module.exports = Router;
