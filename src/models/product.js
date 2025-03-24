/**
 * 产品模型
 * @module models/product
 */

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {
    /**
     * 模型关联配置
     * @param {Object} models - 所有模型对象
     */
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
      
      Product.hasMany(models.ProductRating, {
        foreignKey: 'product_id',
        as: 'ratings'
      });
    }

    /**
     * 更新产品评分
     * @param {number} newScore - 新的评分值
     */
    async updateRatingAvg() {
      const { sequelize } = this.constructor;
      const result = await sequelize.models.ProductRating.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('score')), 'avgRating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: { product_id: this.id, status: 1 }
      });

      if (result) {
        this.rating = parseFloat(result.getDataValue('avgRating')) || 0;
        this.rating_count = parseInt(result.getDataValue('count'), 10) || 0;
        await this.save();
      }
    }
  }

  Product.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    image_url: {
      type: DataTypes.STRING(255)
    },
    official_url: {
      type: DataTypes.STRING(255)
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    pricing: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 0.0
    },
    rating_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '1:正常 0:禁用'
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    indexes: [
      {
        name: 'idx_product_category',
        fields: ['category_id']
      },
      {
        name: 'idx_product_rating',
        fields: ['rating']
      }
    ]
  });

  return Product;
}; 