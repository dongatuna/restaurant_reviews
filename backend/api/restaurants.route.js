const express = require("express")
const RestrantsCtrl = require('./restaurants.controller.js')
const ReviewsCtrl = require('./reviews.controller.js')

const router = express.Router()

router.route('/').get(RestrantsCtrl.apiGetRestaurants)
router.route('/id/:id').get(RestrantsCtrl.apiGetRestaurantById)
router.route('/cuisines').get(RestrantsCtrl.apiGetRestaurantCuisines)

//
router
    .route('/reviews')
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

module.exports = router