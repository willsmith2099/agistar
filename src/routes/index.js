/**
 * API路由配置
 * @module routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');
const validator = require('../middlewares/validator');

// 用户相关路由
router.post('/users/register', validator.validateRegister, userController.register);
router.post('/users/login', validator.validateLogin, userController.login);
router.get('/users/profile', auth, userController.getProfile);

// 产品相关路由
router.get('/products', productController.getProducts);
router.get('/products/trending', productController.getTrendingProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products/:id/ratings', auth, validator.validateRating, productController.addRating);
router.put('/products/:productId/rating', auth, validator.validateRating, productController.updateProductRating);
router.get('/products/:id/ratings/user', auth, productController.getUserProductRating);

// 分类相关路由
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);

module.exports = router; 