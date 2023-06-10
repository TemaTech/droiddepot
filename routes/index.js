const express = require("express");
const update = require("../upload");

const router = express.Router();

// Require controller modules
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");

// HOME PAGE //
router.get("/", (req, res) => {
  res.render("index", { title: "Droid Depot" });
});

//  PRODUCT ROUTES //
// GET all products
router.get("/products", productController.productList);

// GET create product form
router.get("/products/create", productController.createProductGET);

// POST create product
router.post(
  "/products/create",
  update.single("image"),
  productController.createProductPOST
);

// GET product detail
router.get("/products/:productId", productController.productDetail);

// GET update product details
router.get("/products/:productId/update", productController.updateProductGET);

// POST update product detals
router.post(
  "/products/:productId/update",
  update.single("image"),
  productController.updateProductPOST
);

// GET delete the product
router.get("/products/:productId/delete", productController.deleteProductGET);

// POST delete the product
router.post("/products/:productId/delete", productController.deleteProductPOST);

// CATEGORY ROUTES //
// GET all categories
router.get("/categories", categoryController.categoryList);

// GET create category
router.get("/categories/create", categoryController.categoryCreateGET);

// POST create category
router.post(
  "/categories/create",
  update.single("image"),
  categoryController.categoryCreatePOST
);

// GET category products list
router.get("/categories/:categoryId", categoryController.categoryProductsList);

// GET update category details
router.get(
  "/categories/:categoryId/update",
  categoryController.categoryUpdateGET
);

// POST update category details
router.post(
  "/categories/:categoryId/update",
  update.single("image"),
  categoryController.categoryUpdatePOST
);

// GET delete the category
router.get(
  "/categories/:categoryId/delete",
  categoryController.categoryDeleteGET
);

// POST delete the category
router.post(
  "/categories/:categoryId/delete",
  categoryController.categoryDeletePOST
);

module.exports = router;
