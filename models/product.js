/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 100 },
  desc: { type: String, maxLength: 300 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Schema.Types.Decimal128, required: true },
  inStock: { type: Number, required: true },
  image: {
    data: Buffer,
    contentType: String,
  },
});

ProductSchema.virtual("url").get(function getURL() {
  return `/products/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema, "products");
