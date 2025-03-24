/**
 * 产品评分模型
 * @module models/productRating
 */

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProductRating extends Model {
    /**
     * 模型关联配置
     * @param {Object} models - 所有模型对象
     */
    static associate(models) {
      ProductRating.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      ProductRating.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }

  ProductRating.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    score: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 10
      }
    },
    comment: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '1:正常 0:禁用'
    }
  }, {
    sequelize,
    modelName: 'ProductRating',
    tableName: 'product_ratings',
    indexes: [
      {
        name: 'idx_rating_product',
        fields: ['product_id']
      },
      {
        name: 'idx_rating_user',
        fields: ['user_id']
      },
      {
        name: 'uk_user_product',
        unique: true,
        fields: ['user_id', 'product_id']
      }
    ],
    hooks: {
      /**
       * 创建评分后更新产品平均分
       */
      afterCreate: async (rating) => {
        const product = await sequelize.models.Product.findByPk(rating.product_id);
        if (product) {
          await product.updateRatingAvg();
        }
      },
      /**
       * 更新评分后更新产品平均分
       */
      afterUpdate: async (rating) => {
        const product = await sequelize.models.Product.findByPk(rating.product_id);
        if (product) {
          await product.updateRatingAvg();
        }
      },
      /**
       * 删除评分后更新产品平均分
       */
      afterDestroy: async (rating) => {
        const product = await sequelize.models.Product.findByPk(rating.product_id);
        if (product) {
          await product.updateRatingAvg();
        }
      }
    }
  });

  return ProductRating;
}; 