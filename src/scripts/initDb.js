/**
 * 数据库初始化脚本
 * @module scripts/initDb
 */

require('dotenv').config();
const { sequelize, Category, Product, User } = require('../models');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// 初始分类数据
const categories = [
  {
    name: '对话AI',
    description: '智能对话助手类产品',
    sort_order: 1
  },
  {
    name: '图像生成',
    description: 'AI图像生成工具',
    sort_order: 2
  },
  {
    name: '代码助手',
    description: 'AI编程助手类产品',
    sort_order: 3
  },
  {
    name: '内容创作',
    description: 'AI内容生成工具',
    sort_order: 4
  },
  {
    name: '多模态AI',
    description: '支持多种模态的AI产品',
    sort_order: 5
  }
];

// 初始产品数据
const products = [
  {
    name: 'ChatGPT',
    description: 'OpenAI推出的先进对话AI助手，能够进行自然语言对话并提供各种信息和帮助。',
    category_id: 1,
    image_url: 'https://example.com/chatgpt.jpg',
    official_url: 'https://chat.openai.com',
    features: ['多语言支持', '代码生成', '文本分析', '任务自动化'],
    pricing: {
      free: true,
      priceDescription: '基础版免费，Plus版20美元/月'
    }
  },
  {
    name: 'Claude',
    description: 'Anthropic开发的AI助手，注重安全性和有用性，支持长上下文交互。',
    category_id: 1,
    image_url: 'https://example.com/claude.jpg',
    official_url: 'https://claude.ai',
    features: ['长上下文理解', '有帮助、安全、诚实', '文档处理'],
    pricing: {
      free: true,
      priceDescription: '基础版免费，Claude Pro 20美元/月'
    }
  },
  {
    name: 'Midjourney',
    description: '强大的AI图像生成工具，通过文字描述创建高质量艺术图像。',
    category_id: 2,
    image_url: 'https://example.com/midjourney.jpg',
    official_url: 'https://www.midjourney.com',
    features: ['文本到图像', '风格一致性', '高分辨率输出'],
    pricing: {
      free: false,
      priceDescription: '基础版10美元/月，Pro版30美元/月'
    }
  },
  {
    name: 'GitHub Copilot',
    description: 'GitHub和OpenAI合作开发的AI编程助手，可以在多种开发环境中提供代码建议。',
    category_id: 3,
    image_url: 'https://example.com/copilot.jpg',
    official_url: 'https://github.com/features/copilot',
    features: ['代码补全', '函数生成', '多语言支持', 'IDE集成'],
    pricing: {
      free: false,
      priceDescription: '个人10美元/月，企业19美元/月/用户'
    }
  }
];

// 初始用户数据
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password_hash: 'admin123'
  }
];

/**
 * 初始化数据库
 */
async function initDatabase() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    logger.info('数据库连接成功');

    // 同步数据库结构
    await sequelize.sync({ force: true });
    logger.info('数据库表结构已重置');

    // 创建初始分类
    const createdCategories = await Category.bulkCreate(categories);
    logger.info(`成功创建${createdCategories.length}个分类`);

    // 创建初始产品
    const createdProducts = await Product.bulkCreate(products);
    logger.info(`成功创建${createdProducts.length}个产品`);

    // 创建初始用户
    for (const user of users) {
      user.password_hash = await bcrypt.hash(user.password_hash, 10);
    }
    const createdUsers = await User.bulkCreate(users);
    logger.info(`成功创建${createdUsers.length}个用户`);

    logger.info('数据库初始化完成');
    process.exit(0);
  } catch (error) {
    logger.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 执行初始化
initDatabase(); 