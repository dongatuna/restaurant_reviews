const express = require("express") 
const cors = require("cors") 
const restaurants = require("./api/restaurants.route.js")

//instantiate express app
const app = express()

app.use(cors())
//ensure app can read json
app.use(express.json())

app.use('/api/v1/restaurants', restaurants)
//catch-all route
app.use('*', (req, res) => res.status(404).json({error: 'requested page not found'}))

module.exports = app
