/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 100 },
  desc: { type: String, maxLength: 500 },
  image: { type: Schema.Types.Buffer },
});

CategorySchema.virtual("url").get(() => `/categories/${this._id}`);

module.exports = mongoose.model("Category", CategorySchema, "categories");
