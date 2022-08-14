const Campground= require('./models/campground');
module.exports.isLoggedin = (req,res,next)=>
{   
    if(!req.isAuthenticated())
     {
        req.session.backTo = req.originalUrl;
        req.flash('danger','you must logged in');
       return res.render('user/login-form');
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>
{
    const {id} = req.params;
                const camp = await Campground.findById(id).populate('author');
                console.log(req.user.id,camp.author.id);
                if(camp.author.id !== req.user.id)
                {
                    req.flash('danger','you are not allowed to do this')
                  return  res.redirect(`/Campground/${id}`)
                }
                next();
}
