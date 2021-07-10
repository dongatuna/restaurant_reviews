const RestaurantsDAO = require('../dao/restaurantsDAO.js')

class RestaurantController {
    static async apiGetRestaurants( req, res, next ){
        //get the query parameters
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0
        //create an empty filter object
        let filters = {}
        //add entries and values to filters object
        if(req.query.cuisine){
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode){
            filters.zipcode = req.query.zipcode
        } else if (req.query.name){
            filters.name = req.query.name
        }
        //
        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants(
            {
                filters, 
                page, 
                restaurantsPerPage
            }
        )

        let response = {
            restaurants: restaurantsList,
            page,
            filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants
        }
        //send response back in form of JSON
        res.json(response)
    }

    static async apiGetRestaurantById( req, res, next ){
        try {
            let id = req.params.id || {}
            let restaurant = await RestaurantsDAO.getRestaurantByID(id)
            if(!restaurant){
                res.status(404).json({error: "No restaurant with such id"})
                return
            }
            res.json(restaurant)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error })            
        }
    }

    static async apiGetRestaurantCuisines( req, res, next ){
        try {
            let cuisines = await RestaurantsDAO.getCuisines()
            res.json(cuisines)
        } catch (error) {
            console.log(`api, ${ error }`)
            res.status(500).json({ error })
        }
    }
}

module.exports = RestaurantController