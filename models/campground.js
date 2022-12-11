const mongoose = require('mongoose');
const Review = require('./review');

const schema = mongoose.Schema;

const campgroundSchema = new schema(
    {
        title:{

           type: String,
           required:true
        },
        price:{
            type:Number,
            required:true
        },
        location:String,
        img:[
              {
                url:String,
                fileName:String,
              }
        ],
        author:{
            type:schema.Types.ObjectId,
            ref:'User'
        },
        reviews:[
            {
                type:schema.Types.ObjectId,
                ref:'Review'
            }
        ],
        reviewers:[
            {
                type:String
            }
        ]
        
    }
)

//// mongoose middle ware 

campgroundSchema.post('findOneAndDelete',async function(doc)
{
    if(doc)
    {
        await Review.deleteMany({
            id:{
                $in:doc.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground',campgroundSchema);
module.exports = Campground;