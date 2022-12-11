const { model } = require('mongoose');
const { reviewschema } = require('../joiSchema');
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index');
const AppError = require('../utility/expressError');

module.exports.allCampgrounds = async (req,res)=>
{
    
    const camps = await Campground.find({});
    res.render('campground/index.ejs',{camps});
}

module.exports.addCampground = (req,res)=>
{ 
    if(req.user.role=='subAdmin' || req.user.role=='admin'){
      res.render('campground/addform.ejs');
    }
    else{
        req.flash('danger',"You Don't Have Access -- So.. Contact Admin");
        res.redirect('/Campground');
    }
}
module.exports.addedCampground = async (req,res,next)=>
{      
      if(!req.body){
        throw new AppError('Invalid campground data',400);
        return;
      } 
      if(req.user.role=='subAdmin' || req.user.role=='admin'){

          const campground = new Campground(req.body);
          campground.img = req.files.map(f => ({url:f.path,fileName:f.filename}));
          campground.author = req.user.id;
          campground.save();
          req.flash('success','New campground is added');
          
          res.redirect(`/campground/${campground.id}`);  
      }
      else{
          req.flash('danger',"You Don't Have Excess --- Contect Admin");
          res.redirect('/Campground');
      }

}

module.exports.displayOne =async (req,res)=>
{
    const {id} = req.params;
    try{

        const camp = await Campground.findById(id)
        .populate({path:'reviews',
            populate:{
            path:'author'
               }})
            .populate('author')
            
                    res.render('campground/showmore.ejs',{camp})
    } catch(err){

        req.flash('danger','Campground not found :(');
        res.redirect('/Campground');
    }

    
        

    }

module.exports.toUpdate = async (req,res)=>
{
    const {id} = req.params;
    const camp = await Campground.findById(id);
   res.render('campground/updatefrom.ejs',{camp});   

}

module.exports.updeted = async (req,res)=>
{
    if(req.user.role=='subAdmin' || req.user.role=='admin'){

        const {id} = req.params;
        const camp = await Campground.findByIdAndUpdate(id,req.body);
        const arr = req.files.map(f => ({url:f.path,fileName:f.filename}));
         camp.img.push(...arr);
         if(req.body.delete)
         {
            for(let file of req.body.delete)
            {
    
               await cloudinary.uploader.destroy(file);
            }
            await camp.updateOne({$pull:{img:{fileName:{$in:req.body.delete}}}})
         }
         await camp.save();
         req.flash('success','Successfully updated ')
        res.redirect(`/Campground/${id}`);
    }
    else{
        req.flash('danger',"You Don't Have Excess");
        res.redirect('/Campground');
    }

}

module.exports.toDelete = async (req,res)=>
{
    if(req.user.role=='subAdmin' || req.user.role=='admin'){

        const {id} =req.params;
       await Campground.findByIdAndDelete(id);
       req.flash('warning',' you have delelete a campground');
       res.redirect('/Campground');
    }
    else{
        req.flash('danger',"You Don't Have Excess");
        res.redirect('/Campground');
    }
}