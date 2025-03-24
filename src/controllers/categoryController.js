/**
 * 分类相关控制器
 * @module controllers/categoryController
 */

const { Category, Product, sequelize } = require('../models');
const logger = require('../utils/logger');

/**
 * 获取分类列表
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.getCategories = async (req, res, next) => {
  try {
    // 获取分类列表
    const categories = await Category.findAll({
      where: { status: 1 },
      order: [['sort_order', 'ASC'], ['id', 'ASC']],
      attributes: [
        'id', 
        'name', 
        'description', 
        'sort_order',
        'create_time',
        'update_time'
      ]
    });

    // 获取每个分类下的产品数量
    const productCounts = await Product.findAll({
      attributes: [
        'category_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { status: 1 },
      group: ['category_id'],
      raw: true
    });

    // 构建产品数量映射
    const countMap = {};
    productCounts.forEach(item => {
      countMap[item.category_id] = parseInt(item.count);
    });

    // 格式化返回数据
    const result = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      productCount: countMap[category.id] || 0
    }));

    res.json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (error) {
    logger.error('获取分类列表失败:', error);
    next(error);
  }
};

/**
 * 获取分类详情
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOne({
      where: { id, status: 1 },
      attributes: ['id', 'name', 'description', 'sort_order', 'create_time', 'update_time']
    });

    if (!category) {
      return res.status(404).json({
        code: 404,
        message: '分类不存在'
      });
    }

    // 统计该分类下的产品数量
    const productCount = await Product.count({
      where: { category_id: id, status: 1 }
    });

    res.json({
      code: 200,
      message: 'success',
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        productCount,
        createTime: category.create_time,
        updateTime: category.update_time
      }
    });
  } catch (error) {
    logger.error('获取分类详情失败:', error);
    next(error);
  }
}; 