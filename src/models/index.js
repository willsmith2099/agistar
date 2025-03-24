/**
 * 数据模型索引
 * @module models
 */

const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    timezone: dbConfig.timezone,
    define: dbConfig.define,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

// 引入模型
const User = require('./user')(sequelize);
const Category = require('./category')(sequelize);
const Product = require('./product')(sequelize);
const ProductRating = require('./productRating')(sequelize);

// 设置模型关联关系
User.associate({ ProductRating });
Category.associate({ Product });
Product.associate({ Category, ProductRating });
ProductRating.associate({ User, Product });

const db = {
  sequelize,
  Sequelize,
  User,
  Category,
  Product,
  ProductRating
};

module.exports = db; 