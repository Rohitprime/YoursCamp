const express = require('express');
const router = express.Router();
const wrapAsync = require('../utility/catch');
const Campground = require('../models/campground')
const {campgroundschema,reviewschema} = require('../joiSchema');
const AppError = require('../utility/expressError');
const {isLoggedin,isAuthor} = require('../logged -in');
const campgroundControl = require('../controls/campgrounds');
const multer = require('multer');  
const {storage} = require('../cloudinary/index');
const upload = multer({storage});  


          //// middleware

const middle = (req,res,next)=>
{
 const result = campgroundschema.validate(req.body);
 if(result.error)
 {   const msg = result.error.details.map(el => el.message).join(',');
     throw new AppError(msg,404);
 }
 else{
    next();
 }
}



        //   to display all campgrounds 

       router.get('/',wrapAsync(campgroundControl.allCampgrounds))
        
        
        // to add new camp ground
        
       router.get('/add',isLoggedin,campgroundControl.addCampground)
        
     router.post('/',upload.array("image"),middle,wrapAsync(campgroundControl.addedCampground))
   
        
        
        //   to display more details
        
       router.get('/:id', wrapAsync(campgroundControl.displayOne))
        
            //to update the camp ground
        
        router.get('/:id/edit',isLoggedin, wrapAsync(campgroundControl.toUpdate))
        
        router.put('/:id',isLoggedin,isAuthor,upload.array('image'),wrapAsync(campgroundControl.updeted));
        
        //   to delete the camp ground
        
            router.delete('/:id',isLoggedin,isAuthor,wrapAsync(campgroundControl.toDelete));

            router.get('/*',(req,res)=>{
                res.render('campground/error.ejs');
            })
        

   module.exports = router;