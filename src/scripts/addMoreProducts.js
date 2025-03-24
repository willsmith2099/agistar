/**
 * 添加更多产品数据的脚本
 * @module scripts/addMoreProducts
 */

require('dotenv').config();
const { sequelize, Category, Product } = require('../models');
const logger = require('../utils/logger');

// 更多产品数据
const products = [
  {
    name: 'DALL-E',
    description: 'OpenAI开发的先进AI图像生成系统，能够根据文本描述创建详细、创新的图像。',
    category_id: 2, // 图像生成
    image_url: 'https://example.com/dalle.jpg',
    official_url: 'https://openai.com/dall-e-2',
    features: ['文本到图像', '高度精细的图像生成', '风格多样性', '编辑能力'],
    pricing: {
      free: true,
      priceDescription: '有限免费使用，付费积分购买'
    }
  },
  {
    name: 'Cursor',
    description: 'AI驱动的代码编辑器，集成了先进的代码生成、解释和重构功能，提高开发效率。',
    category_id: 3, // 代码助手
    image_url: 'https://example.com/cursor.jpg',
    official_url: 'https://cursor.so',
    features: ['代码补全', '代码解释', '重构建议', '内置AI聊天'],
    pricing: {
      free: true,
      priceDescription: '基础版免费，专业版每月20美元'
    }
  },
  {
    name: 'Jasper',
    description: '面向营销人员的AI内容创作平台，能够生成高质量博客、广告和社交媒体内容。',
    category_id: 4, // 内容创作
    image_url: 'https://example.com/jasper.jpg',
    official_url: 'https://www.jasper.ai',
    features: ['内容生成', '品牌语音管理', '多语言支持', '团队协作'],
    pricing: {
      free: false,
      priceDescription: '起价每月49美元'
    }
  },
  {
    name: 'Anthropic Claude 3',
    description: 'Anthropic最新的多模态AI助手，可以理解图像和文本，提供安全、有帮助的回应。',
    category_id: 5, // 多模态AI
    image_url: 'https://example.com/claude3.jpg',
    official_url: 'https://www.anthropic.com/claude',
    features: ['图像理解', '长上下文窗口', '高准确性', '安全响应'],
    pricing: {
      free: true,
      priceDescription: 'Claude 3 Haiku免费，Opus和Sonnet版付费'
    }
  },
  {
    name: 'Stable Diffusion',
    description: '开源的图像生成模型，允许用户在本地或云端生成高质量的图像。',
    category_id: 2, // 图像生成
    image_url: 'https://example.com/stable-diffusion.jpg',
    official_url: 'https://stablediffusionweb.com',
    features: ['文本到图像', '开源', '社区模型', '本地部署'],
    pricing: {
      free: true,
      priceDescription: '开源免费，有付费云服务'
    }
  },
  {
    name: 'Gemini',
    description: 'Google开发的多模态AI模型，具有强大的推理能力和多语言支持。',
    category_id: 5, // 多模态AI
    image_url: 'https://example.com/gemini.jpg',
    official_url: 'https://gemini.google.com',
    features: ['多模态理解', 'Google服务集成', '多语言支持', '复杂推理'],
    pricing: {
      free: true,
      priceDescription: 'Gemini Free免费，Pro版每月19.99美元'
    }
  }
];

/**
 * 添加更多产品数据
 */
async function addMoreProducts() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    logger.info('数据库连接成功');

    // 添加产品
    const createdProducts = await Product.bulkCreate(products);
    logger.info(`成功添加${createdProducts.length}个新产品`);

    logger.info('添加产品完成');
    process.exit(0);
  } catch (error) {
    logger.error('添加产品失败:', error);
    process.exit(1);
  }
}

// 执行添加产品
addMoreProducts(); 