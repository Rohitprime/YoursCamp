const joi = require('joi');

module.exports.campgroundschema =  joi.object({
    title:joi.string().required(),
    price:joi.number().min(1).required(),
    location:joi.string().required(),
    // img:joi.string().required()

})

module.exports.reviewschema = joi.object(
    {
        rating:joi.number().min(2).required(),
        body:joi.string().required()
    }
)