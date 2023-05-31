const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductReviewSchema = new Schema({
  author: { type: String, maxLength: 100 },
  review: { type: String, required: true, minLength: 1, maxLength: 500 },
  likes: { type: Number, required: true },
  image: { type: Schema.Types.Buffer },
});

module.exports = mongoose.model(
  "ProductReview",
  ProductReviewSchema,
  "productReviews"
);
