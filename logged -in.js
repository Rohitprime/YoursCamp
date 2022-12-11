const Campground= require('./models/campground');
const User = require('./models/user');
module.exports.isLoggedin = async (req,res,next)=>
{   
    if(!req.isAuthenticated())
     {
        req.session.backTo = req.originalUrl;
        let obj ='You must login or register first';
        let code = "danger"
        res.render('user/login-form',{obj,code});
    }
    else{
      next();
    }
}

module.exports.isAuthor = async (req,res,next)=>
{
    const {id} = req.params;
                const camp = await Campground.findById(id).populate('author');
                // console.log(req.user.id,camp.author.id);
                if(camp.author.id !== req.user.id)
                {
                    req.flash('danger','you are not allowed to do this')
                  return  res.redirect(`/Campground/${id}`)
                }
                next();
}
