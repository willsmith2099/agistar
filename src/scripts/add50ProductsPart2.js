/**
 * 添加50个热门AI产品到数据库(第2部分)
 * @module scripts/add50ProductsPart2
 */

require('dotenv').config();
const { Product, Category, sequelize } = require('../models');
const logger = require('../utils/logger');

/**
 * 添加第二批热门AI产品
 * @async
 */
async function add50ProductsPart2() {
  const transaction = await sequelize.transaction();
  
  try {
    // 认证数据库连接
    await sequelize.authenticate();
    logger.info('数据库连接成功', { service: 'agistar-api' });
    
    // 获取所有分类ID
    const categories = await Category.findAll({ transaction });
    const categoryMap = {};
    
    categories.forEach(category => {
      categoryMap[category.name] = category.id;
    });
    
    // 如果缺少"开发工具"分类，先创建它
    if (!categoryMap['开发工具']) {
      const newCategory = await Category.create({
        name: '开发工具',
        description: '用于开发人员的AI工具和框架',
        status: 1
      }, { transaction });
      
      categoryMap['开发工具'] = newCategory.id;
      logger.info(`创建了新分类: 开发工具`, { service: 'agistar-api' });
    }
    
    // 定义第二批AI产品 (产品16-30)
    const productsData = [
      {
        name: "Lobe",
        description: "微软推出的简单易用的机器学习工具，让任何人都能训练自定义AI模型。",
        category_id: categoryMap['多模态AI'],
        image_url: "https://lobe.ai/favicon.ico",
        official_url: "https://www.lobe.ai",
        features: ['无代码机器学习', '图像分类', '导出多平台', '用户友好界面'],
        pricing: { free: true, priceDescription: "免费使用" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Replika",
        description: "AI伴侣应用，提供个性化的对话体验和情感支持。",
        category_id: categoryMap['对话AI'],
        image_url: "https://replika.ai/favicon.ico",
        official_url: "https://replika.ai",
        features: ['个性化AI伴侣', '情感支持', '记忆对话', '个性发展'],
        pricing: { free: true, priceDescription: "基础版免费，Pro版月费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Duolingo Max",
        description: "Duolingo的AI增强版本，使用GPT-4提供高级语言学习功能。",
        category_id: categoryMap['教育辅助'],
        image_url: "https://d35aaqx5ub95lt.cloudfront.net/favicon.ico",
        official_url: "https://www.duolingo.com/max",
        features: ['AI对话练习', '详细解释', '实时反馈', '沉浸式学习'],
        pricing: { free: false, priceDescription: "每月订阅" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Mem AI",
        description: "AI驱动的笔记和知识管理工具，可自动组织和连接信息。",
        category_id: categoryMap['内容创作'],
        image_url: "https://mem.ai/favicon.ico",
        official_url: "https://mem.ai",
        features: ['智能笔记', '自动组织', '知识图谱', '协作工具'],
        pricing: { free: true, priceDescription: "基础版免费，团队版付费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Rytr",
        description: "AI写作助手，帮助快速创建高质量的内容，提供多种内容类型和风格。",
        category_id: categoryMap['内容创作'],
        image_url: "https://rytr.me/favicon.ico",
        official_url: "https://rytr.me",
        features: ['内容生成', '30+语言', '20+写作风格', '内置编辑器'],
        pricing: { free: true, priceDescription: "免费计划有限制，高级版每月29美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Krisp",
        description: "AI噪音消除应用，可在任何会议和录音中消除背景噪音。",
        category_id: categoryMap['音频处理'],
        image_url: "https://krisp.ai/favicon.ico",
        official_url: "https://krisp.ai",
        features: ['噪音消除', '回音消除', '语音增强', '通话记录'],
        pricing: { free: true, priceDescription: "个人免费版，Pro版每月8美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Grammarly",
        description: "AI写作助手，提供语法检查、拼写纠正和写作建议。",
        category_id: categoryMap['内容创作'],
        image_url: "https://static.grammarly.com/assets/files/favicon-32x32.png",
        official_url: "https://www.grammarly.com",
        features: ['语法检查', '写作建议', '风格调整', '多平台支持'],
        pricing: { free: true, priceDescription: "基础版免费，高级版每月12美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Descript",
        description: "AI视频和播客编辑工具，将文本编辑转换为媒体编辑。",
        category_id: categoryMap['视频生成'],
        image_url: "https://www.descript.com/favicon.ico",
        official_url: "https://www.descript.com",
        features: ['文本编辑视频', '转录录音', '屏幕录制', '协作编辑'],
        pricing: { free: true, priceDescription: "免费版有限制，付费版起价每月12美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Notion AI",
        description: "Notion集成的AI助手，帮助写作、总结和组织信息。",
        category_id: categoryMap['内容创作'],
        image_url: "https://www.notion.so/favicon.ico",
        official_url: "https://www.notion.so/product/ai",
        features: ['写作助手', '内容总结', '信息整理', '团队协作'],
        pricing: { free: false, priceDescription: "每月10美元加入Notion订阅" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Firefly",
        description: "Adobe推出的生成式AI创意工具，支持图像生成和编辑。",
        category_id: categoryMap['图像生成'],
        image_url: "https://www.adobe.com/content/dam/shared/images/product-icons/svg/firefly.svg",
        official_url: "https://firefly.adobe.com",
        features: ['文本到图像', '图像编辑', 'Adobe集成', '商业可用'],
        pricing: { free: true, priceDescription: "测试版免费，将集成到Creative Cloud" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Tome",
        description: "AI驱动的演示和讲故事工具，自动生成引人入胜的演示文稿。",
        category_id: categoryMap['内容创作'],
        image_url: "https://tome.app/favicon.ico",
        official_url: "https://tome.app",
        features: ['AI生成演示', '自适应格式', '集成图像生成', '协作功能'],
        pricing: { free: true, priceDescription: "基础版免费，团队版每月收费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Replit AI",
        description: "集成在Replit编码平台中的AI编程助手，提供代码生成和解释。",
        category_id: categoryMap['代码助手'],
        image_url: "https://replit.com/public/favicon.ico",
        official_url: "https://replit.com/ai",
        features: ['代码生成', '代码解释', '调试帮助', '学习辅助'],
        pricing: { free: true, priceDescription: "部分功能免费，完整功能需订阅" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Speechify",
        description: "AI文本转语音应用，可将任何文本转换为自然语音。",
        category_id: categoryMap['音频处理'],
        image_url: "https://speechify.com/favicon.ico",
        official_url: "https://speechify.com",
        features: ['自然语音转换', '多种语言', '阅读速度调整', '多平台支持'],
        pricing: { free: true, priceDescription: "基础版免费，高级版每月月费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Whisper",
        description: "OpenAI开发的开源语音识别系统，提供高精度的多语言转录。",
        category_id: categoryMap['音频处理'],
        image_url: "https://openai.com/content/images/2022/05/openai-avatar.png",
        official_url: "https://openai.com/research/whisper",
        features: ['多语言识别', '高精度转录', '开源模型', '噪音抵抗'],
        pricing: { free: true, priceDescription: "开源免费使用" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Langchain",
        description: "用于开发由语言模型驱动的应用程序的框架，促进AI应用开发。",
        category_id: categoryMap['开发工具'],
        image_url: "https://python.langchain.com/img/favicon.ico",
        official_url: "https://langchain.org",
        features: ['LLM集成', '链式应用', '代理系统', '数据连接'],
        pricing: { free: true, priceDescription: "开源免费使用" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      }
    ];
    
    // 批量创建产品
    const createdProducts = await Product.bulkCreate(productsData, { transaction });
    
    logger.info(`成功添加15个新产品(第2部分)`, { service: 'agistar-api' });
    
    // 提交事务
    await transaction.commit();
    logger.info('第2部分产品添加完成', { service: 'agistar-api' });
    
    return { success: true, count: createdProducts.length };
    
  } catch (error) {
    // 回滚事务
    await transaction.rollback();
    logger.error('添加产品失败:', error, { service: 'agistar-api' });
    return { success: false, error: error.message };
  }
}

// 执行函数
add50ProductsPart2()
  .then(result => {
    if (result.success) {
      logger.info(`成功添加${result.count}个新产品`, { service: 'agistar-api' });
    } else {
      logger.error(`添加产品失败: ${result.error}`, { service: 'agistar-api' });
    }
    
    // 退出进程
    process.exit(0);
  })
  .catch(err => {
    logger.error('未处理的错误:', err, { service: 'agistar-api' });
    process.exit(1);
  });