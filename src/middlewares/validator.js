/**
 * 请求参数验证中间件
 * @module middlewares/validator
 */

const Joi = require('joi');

/**
 * 验证用户注册参数
 */
exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(50).required()
      .messages({
        'string.min': '用户名长度至少为2个字符',
        'string.max': '用户名长度不能超过50个字符',
        'any.required': '用户名不能为空'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': '邮箱格式不正确',
        'any.required': '邮箱不能为空'
      }),
    password: Joi.string().min(6).required()
      .messages({
        'string.min': '密码长度至少为6个字符',
        'any.required': '密码不能为空'
      })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      code: 400,
      message: '参数验证失败',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }
  
  next();
};

/**
 * 验证用户登录参数
 */
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': '邮箱格式不正确',
        'any.required': '邮箱不能为空'
      }),
    password: Joi.string().required()
      .messages({
        'any.required': '密码不能为空'
      })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      code: 400,
      message: '参数验证失败',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }
  
  next();
};

/**
 * 验证产品评分参数
 */
exports.validateRating = (req, res, next) => {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).required()
      .messages({
        'number.base': '评分必须是数字',
        'number.min': '评分最小为1',
        'number.max': '评分最大为5',
        'any.required': '评分不能为空'
      }),
    comment: Joi.string().allow('', null)
      .messages({
        'string.base': '评价必须是字符串'
      })
  });

  // 兼容旧版API，支持score字段
  if (req.body.score && !req.body.rating) {
    req.body.rating = req.body.score;
  }

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      code: 400,
      message: '参数验证失败',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }
  
  next();
}; 