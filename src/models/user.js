/**
 * 用户模型
 * @module models/user
 */

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * 密码比对
     * @param {string} password - 待验证的密码
     * @returns {Promise<boolean>} 比对结果
     */
    async comparePassword(password) {
      return bcrypt.compare(password, this.password_hash);
    }

    /**
     * 模型关联配置
     * @param {Object} models - 所有模型对象
     */
    static associate(models) {
      User.hasMany(models.ProductRating, {
        foreignKey: 'user_id',
        as: 'ratings'
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 50]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar_url: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '1:正常 0:禁用'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      /**
       * 创建前密码加密
       */
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      },
      /**
       * 更新前密码加密
       */
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      }
    }
  });

  return User;
}; 