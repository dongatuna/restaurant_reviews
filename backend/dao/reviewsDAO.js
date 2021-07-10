const { ObjectId } = require('mongodb')

let reviews 

class ReviewsDAO {
    // constructor(){
    //     this._reviews;        
    // }

    static async injectDB(conn){
        if(reviews) return
        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection('reviews')
        } catch (error) {
            console.error(`Unable to establish collection handles in userDAO: ${error}`)
        }
    }

    static async addReview(restaurantId, user, review, date){
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date,
                text: review,
                restaurant_id: ObjectId(restaurantId)
            }

            console.log(reviewDoc)            
    
            return await reviews.insertOne(reviewDoc)
        } catch (error) {
            console.error(`Unable to post review ${error}`)
            return { error }
        }       
    }

    static async updateReview(reviewId, userId, text, date){
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id: ObjectId(reviewId) },
                { $set: {text: text, date:date} }
            )

            console.log(`RESPONSE FOR UPDATE: ${updateResponse} `)

            return updateResponse
            
        } catch (error) {
            console.error(`Unable to update review: ${ error }`)
            return { error }
        }
    }

    static async deleteReview(reviewId, userId){
        try {
            const deleteResponse = await reviews.deleteOne({ 
                _id: ObjectId(reviewId),
                user_id: userId
            })

            return deleteResponse
        } catch (error) {
            console.error(`Unable to delete review: ${ error }`)
            return { error }
        }

    }
}

module.exports = ReviewsDAO