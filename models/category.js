/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 100 },
  desc: { type: String, maxLength: 300 },
  image: {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
});

CategorySchema.virtual("url").get(function getURL() {
  return `/categories/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema, "categories");
