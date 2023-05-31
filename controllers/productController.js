// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require("express-async-handler");
const Product = require("../models/product");

// Display a list of all products
exports.productList = asyncHandler(async (req, res) => {
  const productList = await Product.find().sort({ reviews: -1 }).exec();

  res.render("product/productList", {
    title: "All Products",
    productList,
  });
});

// Display the detail page for a product
exports.productDetail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate(
    "reviews"
  );

  if (!product) {
    const err = new Error("Product has not been found");
    err.status = 404;
    next(err);
  } else {
    // Sort product reviews by amount of likes in descending order
    product.reviews.sort((a, b) => b.likes - a.likes);

    res.render("product/productDetail", {
      title: product.name,
      product,
    });
  }
});
