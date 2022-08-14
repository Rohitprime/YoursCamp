const { model } = require('mongoose');
const { reviewschema } = require('../joiSchema');
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index');

module.exports.allCampgrounds = async (req,res)=>
{
    const camps = await Campground.find({});
    res.render('campground/index.ejs',{camps});
}

module.exports.addCampground = (req,res)=>
{
    res.render('campground/addform.ejs');
}
module.exports.addedCampground = async (req,res,next)=>
{
        const campground = new Campground(req.body);
        campground.img = req.files.map(f => ({url:f.path,fileName:f.filename}));
        campground.author = req.user.id;
        campground.save();
        req.flash('success','new campground is added');
        
        res.redirect(`/campground/${campground.id}`);  

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

        req.flash('danger','campground not found');
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
    res.redirect(`/Campground/${id}`);
}

module.exports.toDelete = async (req,res)=>
{
         const {id} =req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('warning',' you have delelete a campground');
        res.redirect('/Campground');

}