const express = require('express')
const router = express.Router();
const productController = require("../controllers/product.controller");
const jwtVerify = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const uploadImage = require('../middlewares/uploadProductImage')
// Crear rutas de productos

router.get("/products", productController.getProducts)

router.post("/products",uploadImage, productController.createProduct)

router.put("/products/:id", [jwtVerify , uploadImage], productController.updateProduct)

router.delete("/products/:id", [jwtVerify, isAdmin], productController.deleteProduct)

router.get('/products/search/:search', productController.searchProduct)

module.exports = router;
