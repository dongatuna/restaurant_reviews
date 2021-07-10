const ReviewsDAO = require('../dao/reviewsDAO')

class ReviewsController{
    //method for posting review
    static async apiPostReview( req, res, next ){
        try {
            //get data from req.bodydv
            const { restaurantId, text, name, user_id } = req.body

            //
            const review = text
            const userInfo = {
                name,
                _id: user_id
            }

            const date = new Date()

            const ReviewResponse = await ReviewsDAO.addReview(
                restaurantId, userInfo, review, date
            )

            res.json({ status: "success" })
            
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }

    static async apiUpdateReview ( req, res, next ){
        try {
            const { review_id, text, user_id } = req.body

            console.log(`REQ BODY ${JSON.stringify(req.body)}`)

            const date = new Date()  
            
            console.log(`Date: ${date}`)
           
            const reviewResponse = await ReviewsDAO.updateReview(
                review_id, user_id, text, date
            )

            var { error } = reviewResponse

            if(error){
                res.status(400).json({error})
            }

            if(reviewResponse.modifiedCount === 0){
                throw new Error(`Unable to update review - user may not be original poster`)
            }

            res.json({status: "success"})
        } catch (error) {
            res.status(500).json({ error: error.message})
        }
    }

    static async apiDeleteReview(req, res, next ){
        try {
            const reviewId = req.query.id
            const userId = req.body.user_id

            console.log(reviewId)

            const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId)

            res.json({ status: "success"})
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }
}

module.exports = ReviewsController