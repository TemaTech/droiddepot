/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Category = require("../models/category");
const Product = require("../models/product");

// Display a list of all categories
exports.categoryList = asyncHandler(async (req, res) => {
  const categoryList = await Category.find().sort({ name: 1 }).exec();

  res.render("category/categoryList", {
    title: "Categories",
    categoryList,
  });
});

// Display all products in the category
exports.categoryProductsList = asyncHandler(async (req, res) => {
  const productList = await Product.find()
    .populate("category")
    .where("category")
    .equals(req.params.categoryId)
    .sort({ name: 1 })
    .exec();

  const category = await Category.findById(req.params.categoryId);

  res.render("category/categoryProductsList", {
    title: `Products in ${category.name} category`,
    productList,
    category,
  });
});

// Render a form page for creating a new category
exports.categoryCreateGET = asyncHandler(async (req, res) => {
  res.render("category/categoryForm", {
    title: "Add a new category",
  });
});

// Process a post request for creating a new category
exports.categoryCreatePOST = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "The 'Category Name' field must be between 1 and 100 characters in length."
    )
    .escape(),
  body("desc")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 300 })
    .withMessage(
      "The 'Category Description' field must be shorter than 300 characters."
    )
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

    const category = new Category({
      name: req.body.name,
      desc: req.body.desc,
      image: {
        data: imageData,
        contentType: imageExtName,
      },
    });

    if (!errors.isEmpty()) {
      res.render("category/categoryForm", {
        title: "Add a new category",
        category,
        errors: errors.array(),
      });
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];

// Renders the update category page
exports.categoryUpdateGET = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId).exec();

  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    next(error);
  } else {
    res.render("category/categoryForm", {
      title: "Update the category",
      category,
    });
  }
});

// Processes the category update request
exports.categoryUpdatePOST = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "The 'Category Name' field must be between 1 and 100 characters in length."
    )
    .escape(),
  body("desc")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 300 })
    .withMessage(
      "The 'Category Description' field must be shorter than 300 characters."
    )
    .escape(),
  body("image").trim().escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const oldCategory = await Category.findById(req.params.categoryId).exec();

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
        : oldCategory.image;

    const category = new Category({
      _id: oldCategory._id,
      name: req.body.name,
      desc: req.body.desc,
      image,
    });

    if (!errors.isEmpty()) {
      res.render("category/categoryForm", {
        title: "Update the category",
        category,
        errors: errors.array(),
      });
    } else {
      await Category.findByIdAndUpdate(req.params.categoryId, category);
      res.redirect(category.url);
    }
  }),
];

// Render the delete category page
exports.categoryDeleteGET = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId).exec();

  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    next(error);
  } else {
    res.render("category/categoryDeleteForm", {
      title: "Delete the category",
      category,
    });
  }
});

// Process the POST request for deleting a category
exports.categoryDeletePOST = asyncHandler(async (req, res) => {
  const allProductsInTheCategory = await Product.find()
    .where("category")
    .equals(req.params.categoryId)
    .exec();

  if (allProductsInTheCategory.length === 0) {
    await Category.findByIdAndDelete(req.params.categoryId);
    res.redirect("/categories");
  } else {
    const category = await Category.findById(req.params.categoryId).exec();

    res.render("category/categoryDeleteForm", {
      title: "Delete the category",
      category,
      allProductsInTheCategory,
    });
  }
});
