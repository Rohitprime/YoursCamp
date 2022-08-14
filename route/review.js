const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utility/catch');
const AppError = require('../utility/expressError');
const {campgroundschema,reviewschema} = require('../joiSchema');
const Campground = require('../models/campground')
const Review = require('../models/review');
const {isLoggedin} = require('../logged -in');
const reviewControl = require('../controls/review');



///  --   middleware

const reviewmiddle = (req,res,next)=>
{
 const result = reviewschema.validate(req.body);
 if(result.error)
 {   const msg = result.error.details.map(el => el.message).join(',');
     throw new AppError(msg,404);
 }
 else{
    next();
 }
}


   ////      collecting reviews
router.post('/',isLoggedin,reviewmiddle,wrapAsync(reviewControl.getReviews));

//////        deleteing reviews
   
router.delete('/:rid',isLoggedin, wrapAsync(reviewControl.toDelete));


module.exports= router;
