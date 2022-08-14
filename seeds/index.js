const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cites');
const {descriptors,places} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() =>
{
    console.log('connected good to go');
})
.catch((err) =>
{
    console.log('connection failed!!!!!');
})

const arr = array => array[Math.floor(Math.random()*10)];

const seeddb = async() =>{
    await Campground.deleteMany({});
        for(let i=0; i<5; ++i)
        {
            const city = cities[Math.floor(Math.random()*1000)];
            const camp = new Campground({title:`${ arr(descriptors)} ${ arr(places)}`,
                                        location:`${city.city} ${city.state}`,
                                        price:Math.random()*100,
                                        author:'62b009a3a3c37db3dd805b3d',
                                        img: [
                                            {
                                                    "url" : "https://res.cloudinary.com/diszakm5s/image/upload/v1655955217/yelpCamp/tecmvlxekupq55w0mha8.jpg",
                                                    "fileName" : "yelpCamp/tecmvlxekupq55w0mha8"
                                            
                                            },
                                            {
                                                    "url" : "https://res.cloudinary.com/diszakm5s/image/upload/v1655955223/yelpCamp/bxumwmprpzmrgf0zxicw.jpg",
                                                    "fileName" : "yelpCamp/bxumwmprpzmrgf0zxicw"
                                    
                                            }
                                    ]
                     });
            await camp.save();
        }
}

seeddb();