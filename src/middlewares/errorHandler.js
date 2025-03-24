/**
 * 全局错误处理中间件
 * @module middlewares/errorHandler
 */

const logger = require('../utils/logger');

/**
 * 错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
module.exports = (err, req, res, next) => {
  logger.error('错误:', err);

  // 开发环境返回详细错误信息
  const error = process.env.NODE_ENV === 'development' ? {
    message: err.message,
    stack: err.stack
  } : {
    message: '服务器内部错误'
  };

  res.status(500).json({
    code: 500,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
}; 