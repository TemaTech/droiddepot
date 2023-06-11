/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Product = require("../models/product");
const Category = require("../models/category");

// Display a list of all products
exports.productList = asyncHandler(async (req, res) => {
  const productList = await Product.find()
    .populate("category", "name")
    .sort({ name: 1 })
    .exec();

  res.render("product/productList", {
    title: "All Products",
    productList,
  });
});

// Display the detail page for a product
exports.productDetail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate(
    "category"
  );

  if (!product) {
    const err = new Error("Product has not been found");
    err.status = 404;
    next(err);
  } else {
    res.render("product/productDetail", {
      title: product.name,
      product,
    });
  }
});

// Render a form page for creating a new product
exports.createProductGET = asyncHandler(async (req, res) => {
  const allCategories = await Category.find().exec();

  res.render("product/productForm", {
    title: "Add a new product",
    allCategories,
  });
});

// Process a post request for creating a new product
exports.createProductPOST = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage(
      "The 'Product Name' field must be between 1 and 100 characters in length."
    )
    .escape(),
  body("desc")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 300 })
    .withMessage(
      "The 'Product Description' field must be shorter than 300 characters."
    )
    .escape(),
  body("category", "The 'Product Category' field must be specified.")
    .trim()
    .escape(),
  body("price", "The 'Product Price' field must be specified.")
    .trim()
    .isFloat({ min: 0 })
    .withMessage(
      "The 'Product Price' field must be a number or a floating number."
    )
    .escape(),
  body("inStock", "The 'Products in stock' field must be specified")
    .trim()
    .isInt({ allow_leading_zeroes: false, min: 0 })
    .withMessage("The 'Products in stock' field must be a whole number.")
    .escape(),
  body("image").trim().escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const imageData = req.file?.filename
      ? fs.readFileSync(
          path.join(__dirname, "..", "/uploads/", req.file.filename)
        )
      : undefined;

    const imageExtName = req.file?.filename
      ? path.extname(req.file.filename)
      : undefined;

    const product = new Product({
      name: req.body.name,
      desc: req.body.desc,
      category: req.body.category,
      price: req.body.price,
      inStock: req.body.inStock,
      image: {
        data: imageData,
        contentType: imageExtName,
      },
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();

      res.render("product/productForm", {
        title: "Add a new product",
        product,
        errors: errors.array(),
        allCategories,
      });
    } else {
      await product.save();
      res.redirect(product.url);
    }
  }),
];

// Renders the update product page
exports.updateProductGET = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();
  const product = await Product.findById(req.params.productId).exec();

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    next(error);
  } else {
    res.render("product/productForm", {
      title: "Update the product",
      allCategories,
      product,
    });
  }
});

// Process a POST request for updating a product
exports.updateProductPOST = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage(
      "The 'Product Name' field must be between 1 and 100 characters in length."
    )
    .escape(),
  body("desc")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 300 })
    .withMessage(
      "The 'Product Description' field must be shorter than 300 characters."
    )
    .escape(),
  body("category", "The 'Product Category' field must be specified.")
    .trim()
    .escape(),
  body("price", "The 'Product Price' field must be specified.")
    .trim()
    .isFloat({ min: 0 })
    .withMessage(
      "The 'Product Price' field must be a number or a floating number."
    )
    .escape(),
  body("inStock", "The 'Products in stock' field must be specified")
    .trim()
    .isInt({ allow_leading_zeroes: false, min: 0 })
    .withMessage("The 'Products in stock' field must be a whole number.")
    .escape(),
  body("image").trim().escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const oldProduct = await Product.findById(req.params.productId).exec();

    const imageData = req.file?.filename
      ? fs.readFileSync(
          path.join(__dirname, "..", "/uploads/", req.file.filename)
        )
      : undefined;

    const imageExtName = req.file?.filename
      ? path.extname(req.file.filename)
      : undefined;

    const image =
      imageData && imageExtName
        ? {
            data: imageData,
            contentType: imageExtName,
          }
        : oldProduct.image;

    const product = {
      _id: oldProduct._id,
      name: req.body.name,
      desc: req.body.desc,
      category: req.body.category,
      price: req.body.price,
      inStock: req.body.inStock,
      image,
    };

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();

      res.render("product/productForm", {
        title: "Add a new product",
        product,
        errors: errors.array(),
        allCategories,
      });
    } else {
      await Product.findByIdAndUpdate(req.params.productId, {
        name: req.body.name,
        desc: req.body.desc,
        category: req.body.category,
        price: req.body.price,
        inStock: req.body.inStock,
        image,
      });
      res.redirect(oldProduct.url);
    }
  }),
];

// Render the delete product page
exports.deleteProductGET = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId)
    .populate("category")
    .exec();

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    next(error);
  } else {
    res.render("product/productDeleteForm", {
      title: "Delete the product",
      product,
    });
  }
});

// Process a POST request for deleting a product
exports.deleteProductPOST = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);
  res.redirect("/products");
});
