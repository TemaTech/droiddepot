/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 100 },
  desc: { type: String, maxLength: 500 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Schema.Types.Decimal128, required: true },
  inStock: { type: Number, required: true },
  image: { type: Schema.Types.Buffer },
  reviews: [{ type: Schema.Types.ObjectId, ref: "ProductReview" }],
});

ProductSchema.virtual("url").get(() => `/products/${this._id}`);

module.exports = mongoose.model("Product", ProductSchema, "products");
