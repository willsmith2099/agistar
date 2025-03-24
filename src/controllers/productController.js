/**
 * 产品相关控制器
 * @module controllers/productController
 */

const { Product, Category, ProductRating, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * 获取产品列表
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      category, 
      sortBy = 'rating', 
      sortOrder = 'desc' 
    } = req.query;

    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    // 构建查询条件
    const where = { status: 1 };
    if (category) {
      where.category_id = category;
    }

    // 构建排序条件
    const order = [];
    if (sortBy === 'rating') {
      order.push(['rating', sortOrder.toUpperCase()]);
    } else if (sortBy === 'createTime') {
      order.push(['create_time', sortOrder.toUpperCase()]);
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    // 格式化返回数据
    const products = rows.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category.name,
      rating: product.rating,
      imageUrl: product.image_url,
      officialUrl: product.official_url,
      createTime: product.create_time,
      updateTime: product.update_time
    }));

    res.json({
      code: 200,
      message: 'success',
      data: {
        total: count,
        items: products
      }
    });
  } catch (error) {
    logger.error('获取产品列表失败:', error);
    next(error);
  }
};

/**
 * 获取产品详情
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({
      where: { id, status: 1 },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }

    // 获取产品最新评分记录
    const ratings = await ProductRating.findAll({
      where: { product_id: id, status: 1 },
      limit: 5,
      order: [['create_time', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar_url']
        }
      ]
    });

    // 格式化返回数据
    const productData = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category.name,
      rating: product.rating,
      imageUrl: product.image_url,
      officialUrl: product.official_url,
      features: product.features,
      pricing: product.pricing,
      latestRatings: ratings.map(r => ({
        id: r.id,
        score: r.score,
        comment: r.comment,
        user: {
          id: r.user.id,
          username: r.user.username,
          avatarUrl: r.user.avatar_url
        },
        createTime: r.create_time
      })),
      createTime: product.create_time,
      updateTime: product.update_time
    };

    res.json({
      code: 200,
      message: 'success',
      data: productData
    });
  } catch (error) {
    logger.error('获取产品详情失败:', error);
    next(error);
  }
};

/**
 * 添加产品评分
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.addRating = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const { score, comment } = req.body;
    const userId = req.user.id;
    
    const product = await Product.findOne({
      where: { id: productId, status: 1 }
    });

    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }
    
    // 检查是否已经评分过
    const existingRating = await ProductRating.findOne({
      where: { product_id: productId, user_id: userId }
    });
    
    let rating;
    
    if (existingRating) {
      // 更新现有评分
      existingRating.score = score;
      existingRating.comment = comment;
      rating = await existingRating.save();
    } else {
      // 创建新评分
      rating = await ProductRating.create({
        product_id: productId,
        user_id: userId,
        score,
        comment
      });
    }

    res.status(201).json({
      code: 200,
      message: '评分成功',
      data: {
        id: rating.id,
        productId: rating.product_id,
        score: rating.score,
        comment: rating.comment,
        createTime: rating.create_time
      }
    });
  } catch (error) {
    logger.error('添加产品评分失败:', error);
    next(error);
  }
};

/**
 * 获取趋势产品
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.getTrendingProducts = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    
    // 获取评分最高的产品
    const topRatedProducts = await Product.findAll({
      where: { status: 1 },
      limit: parseInt(limit),
      order: [['rating', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    // 格式化返回数据
    const products = topRatedProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category.name,
      rating: product.rating,
      imageUrl: product.image_url,
      officialUrl: product.official_url
    }));

    res.json({
      code: 200,
      message: 'success',
      data: products
    });
  } catch (error) {
    logger.error('获取趋势产品失败:', error, { service: 'agistar-api' });
    next(error);
  }
};

/**
 * 更新产品评分
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.updateProductRating = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        code: 400,
        message: '评分必须在1-5之间'
      });
    }
    
    // 查找产品
    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }
    
    // 查找用户是否已经评过分
    let userRating = await ProductRating.findOne({
      where: { 
        product_id: productId,
        user_id: userId
      },
      transaction
    });
    
    // 如果用户已经评过分，更新评分；否则创建新评分
    if (userRating) {
      userRating.score = rating;
      userRating.comment = comment || userRating.comment;
      await userRating.save({ transaction });
    } else {
      userRating = await ProductRating.create({
        product_id: productId,
        user_id: userId,
        score: rating,
        comment: comment || '',
        status: 1
      }, { transaction });
    }
    
    // 计算产品的新平均评分
    const ratingStats = await ProductRating.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('score')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'ratingCount']
      ],
      where: { 
        product_id: productId,
        status: 1
      },
      transaction
    });
    
    // 更新产品的评分信息
    product.rating = parseFloat(ratingStats.dataValues.averageRating || 0).toFixed(1);
    product.rating_count = parseInt(ratingStats.dataValues.ratingCount || 0);
    await product.save({ transaction });
    
    await transaction.commit();
    
    res.json({
      code: 200,
      message: '评分更新成功',
      data: {
        productId,
        newRating: product.rating,
        ratingCount: product.rating_count,
        userRating: {
          score: userRating.score,
          comment: userRating.comment
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('更新产品评分失败:', error, { service: 'agistar-api' });
    next(error);
  }
};

/**
 * 获取用户对产品的评分
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.getUserProductRating = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const userId = req.user.id;
    
    // 检查产品是否存在
    const product = await Product.findOne({
      where: { id: productId, status: 1 }
    });
    
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }
    
    // 查找用户的评分
    const rating = await ProductRating.findOne({
      where: {
        product_id: productId,
        user_id: userId,
        status: 1
      }
    });
    
    if (!rating) {
      return res.json({
        code: 200,
        message: '用户尚未评分',
        data: null
      });
    }
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        productId,
        score: rating.score,
        comment: rating.comment,
        createTime: rating.create_time
      }
    });
  } catch (error) {
    logger.error('获取用户产品评分失败:', error, { service: 'agistar-api' });
    next(error);
  }
}; 