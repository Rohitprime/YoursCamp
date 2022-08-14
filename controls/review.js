const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.getReviews = async (req,res)=>
{
       const {id} = req.params;
       const campground = await Campground.findById(id);
       const review = new Review(req.body);
       review.author = req.user.id;
       campground.reviews.push(review);
       await campground.save();
       await review.save();
       res.redirect(`/Campground/${id}`);
 }

 module.exports.toDelete = async (req,res)=>
 {  
     const {id,rid} = req.params;
     const review = await Review.findById(rid).populate('author');
     if(review.author.id !== req.user.id)
     {
         req.flash('danger',"you can't delete it");
        return  res.redirect(`/Campground/${id}`);
     }
     await Campground.findByIdAndUpdate(id,{$pull:{reviews:rid}});
     await Review.findByIdAndDelete(rid);
     res.redirect(`/Campground/${id}`);
 }