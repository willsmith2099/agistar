/**
 * 用户相关控制器
 * @module controllers/userController
 */

const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('sequelize');
const logger = require('../utils/logger');

/**
 * 用户注册
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.create({
      username,
      email,
      password_hash: password
    });

    res.status(201).json({
      code: 200,
      message: '注册成功',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        createTime: user.create_time
      }
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        code: 400,
        message: '参数验证失败',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    next(error);
  }
};

/**
 * 用户登录
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在'
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,
        message: '密码错误'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    logger.error('用户登录失败:', error);
    next(error);
  }
};

/**
 * 获取用户个人资料
 * @async
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next中间件
 */
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'avatar_url', 'create_time', 'update_time']
    });
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatar_url,
        createTime: user.create_time,
        updateTime: user.update_time
      }
    });
  } catch (error) {
    logger.error('获取用户资料失败:', error, { service: 'agistar-api' });
    next(error);
  }
}; 