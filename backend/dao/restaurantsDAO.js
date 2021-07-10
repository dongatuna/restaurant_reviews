//create a variable to store restaurants collection
let restaurants 

class RestaurantsDAO {
    //method 1
    //connects to database
    static async injectDB(conn){
        //if the variable has restaurants, return
        if(restaurants) return

        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants')
        } catch (error) {
            console.error(`Unable to establish a collection handle on restaurantsDAO ${error}`)
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20
    } = {}){
        //create a query variable
        let query
        if(filters){
            if("name" in filters){
                query = { $text: { $search: filters["name"]}}
            } else if ('cuisine' in filters) {
                query = {'cuisine': {$eq: filters["cuisine"]}}
            } else if ('zipcode' in filters){
                query = {'address.zipcode': {$eq: filters['zipcode']}}
            }
        }

        let cursor

        try {
            cursor = await restaurants.find(query)
        } catch (error) {
            console.error(`Unable to find command, ${error}`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
        //shows the results of a particular page
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage*page)

        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return { restaurantsList, totalNumRestaurants }

        } catch (error){
            console.error(`Unable to convert cursor to array or problem counting documents, ${error.stack}`)

            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }

    static async getRestaurantByID(id) {
        try {
          const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
                  {
                      $lookup: {
                          from: "reviews",
                          let: {
                              id: "$_id",
                          },
                          pipeline: [
                              {
                                  $match: {
                                      $expr: {
                                          $eq: ["$restaurant_id", "$$id"],
                                      },
                                  },
                              },
                              {
                                  $sort: {
                                      date: -1,
                                  },
                              },
                          ],
                          as: "reviews",
                      },
                  },
                  {
                      $addFields: {
                          reviews: "$reviews",
                      },
                  },
              ]
          return await restaurants.aggregate(pipeline).next()
        } catch (e) {
          console.error(`Something went wrong in getRestaurantByID: ${e}`)
          throw e
        }
    }

    static async getCuisines() {
        let cuisines = []
        try {
          cuisines = await restaurants.distinct("cuisine")
          return cuisines
        } catch (e) {
          console.error(`Unable to get cuisines, ${e}`)
          return cuisines
        }
    }
    
}

module.exports = RestaurantsDAO