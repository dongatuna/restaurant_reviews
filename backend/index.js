const app = require("./server.js") 
const { MongoClient } = require ('mongodb') 
const dotenv = require("dotenv")
const RestaurantsDAO = require('./dao/restaurantsDAO.js')
const ReviewsDAO = require('./dao/reviewsDAO')

dotenv.config()

const port = process.env.PORT || 5000
//connect to the database
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI, 
    {   
        poolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }).catch(e => {
        console.error(e.stack);
        process.exit(1)
    }).then(async client =>{
        //this gets the initial referance to restaurants collection in database
        await RestaurantsDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })