// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require("express-async-handler");
const Category = require("../models/category");

// Display a list of all categories
exports.categoryList = asyncHandler(async (req, res) => {
  const categoryList = await Category.find().sort({ name: 1 }).exec();

  res.render("category/categoryList", {
    title: "Categories",
    categoryList,
  });
});
