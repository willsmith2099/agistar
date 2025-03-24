/**
 * 添加50个热门AI产品到数据库
 * @module scripts/add50Products
 */

require('dotenv').config();
const { Product, Category, sequelize } = require('../models');
const logger = require('../utils/logger');

/**
 * 添加50个热门AI产品
 * @async
 */
async function add50Products() {
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
    
    // 如果缺少某些分类，先创建它们
    const requiredCategories = [
      '对话AI', '图像生成', '代码助手', '内容创作', '多模态AI', 
      '视频生成', '音频处理', '数据分析', '翻译工具', '教育辅助'
    ];
    
    for (const catName of requiredCategories) {
      if (!categoryMap[catName]) {
        const newCategory = await Category.create({
          name: catName,
          description: `${catName}相关的AI工具和产品`,
          status: 1
        }, { transaction });
        
        categoryMap[catName] = newCategory.id;
        logger.info(`创建了新分类: ${catName}`, { service: 'agistar-api' });
      }
    }
    
    // 定义50个AI产品 (第1部分，产品1-15)
    const productsData = [
      {
        name: "Bard",
        description: "Google的AI聊天助手，提供对话服务和实时互联网信息访问能力。",
        category_id: categoryMap['对话AI'],
        image_url: "https://www.gstatic.com/lamda/images/favicon_v1_70c82fa612c571fc0b3e6341eb8e6ccb.svg",
        official_url: "https://bard.google.com",
        features: ['实时互联网访问', '图像理解', '代码生成', '多语言支持'],
        pricing: { free: true, priceDescription: "免费使用" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Perplexity AI",
        description: "结合搜索引擎和大语言模型的AI助手，可提供带引用的实时信息。",
        category_id: categoryMap['对话AI'],
        image_url: "https://www.perplexity.ai/favicon.ico",
        official_url: "https://www.perplexity.ai",
        features: ['实时互联网搜索', '学术研究辅助', '内容总结', '引用来源'],
        pricing: { free: true, priceDescription: "基础版免费，Pro版每月20美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Runway Gen-2",
        description: "先进的AI视频生成工具，能够从文本描述或图像生成短视频。",
        category_id: categoryMap['视频生成'],
        image_url: "https://cdn.sanity.io/images/dp4ffe0f/production/f38603cbc8ace85afb8c9a6bb0aa2422589ccfdf-400x400.png",
        official_url: "https://runwayml.com",
        features: ['文本到视频', '图像到视频', '视频编辑', '创意工具'],
        pricing: { free: false, priceDescription: "起价每月15美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Leonardo.AI",
        description: "强大的AI图像生成平台，专为游戏开发和创意设计人员打造。",
        category_id: categoryMap['图像生成'],
        image_url: "https://leonardo.ai/apple-touch-icon.png",
        official_url: "https://leonardo.ai",
        features: ['高质量图像生成', '游戏资产创建', '批量生成', '自定义训练'],
        pricing: { free: true, priceDescription: "免费版有限制，专业版每月月费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "ElevenLabs",
        description: "尖端语音合成平台，提供逼真的AI语音克隆和生成。",
        category_id: categoryMap['音频处理'],
        image_url: "https://elevenlabs.io/favicon.ico",
        official_url: "https://elevenlabs.io",
        features: ['语音克隆', '多语言支持', '情感控制', '音频库'],
        pricing: { free: true, priceDescription: "免费版每月提供一定额度，专业版起价每月22美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Synthesia",
        description: "AI视频生成平台，可以从文本创建有真人主持人的专业视频。",
        category_id: categoryMap['视频生成'],
        image_url: "https://www.synthesia.io/favicon.png",
        official_url: "https://www.synthesia.io",
        features: ['AI视频生成', '多语言支持', '自定义虚拟人物', '模板库'],
        pricing: { free: false, priceDescription: "起价每月30美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "HuggingChat",
        description: "由Hugging Face推出的开源AI聊天助手，提供开放模型选择。",
        category_id: categoryMap['对话AI'],
        image_url: "https://huggingface.co/favicon.ico",
        official_url: "https://huggingface.co/chat",
        features: ['开源模型支持', '多模态能力', '代码辅助', '免费使用'],
        pricing: { free: true, priceDescription: "完全免费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Nova AI",
        description: "结合AI和高质量摄影的肖像生成工具，创建专业级人像。",
        category_id: categoryMap['图像生成'],
        image_url: "https://nova-ai.com/nova/favicon.ico",
        official_url: "https://nova-ai.com",
        features: ['专业人像生成', '多种风格和姿势', '高分辨率输出', '个性化定制'],
        pricing: { free: false, priceDescription: "按照生成的图像数量计费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Poe",
        description: "Quora开发的AI聊天平台，集成多种大语言模型，提供统一界面访问。",
        category_id: categoryMap['对话AI'],
        image_url: "https://poe.com/favicon.ico",
        official_url: "https://poe.com",
        features: ['多模型支持', '聊天历史', '自定义机器人', '移动应用'],
        pricing: { free: true, priceDescription: "基础版免费，订阅版每月20美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Tabnine",
        description: "专为开发者设计的AI代码助手，支持多种编程语言和IDE。",
        category_id: categoryMap['代码助手'],
        image_url: "https://www.tabnine.com/favicon.ico",
        official_url: "https://www.tabnine.com",
        features: ['代码补全', '全行建议', '多语言支持', '私有代码训练'],
        pricing: { free: true, priceDescription: "个人免费版，团队专业版起价每人每月12美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Bing AI",
        description: "微软Bing搜索引擎集成的AI助手，提供对话和创意内容生成功能。",
        category_id: categoryMap['对话AI'],
        image_url: "https://www.bing.com/favicon.ico",
        official_url: "https://www.bing.com/new",
        features: ['实时搜索集成', '创意写作', '图像生成', '多模式对话'],
        pricing: { free: true, priceDescription: "免费使用" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Character.AI",
        description: "允许��户与AI角色聊天的平台，支持创建和分享自定义角色。",
        category_id: categoryMap['对话AI'],
        image_url: "https://character.ai/favicon.ico",
        official_url: "https://character.ai",
        features: ['角色创建', '社区分享', '个性化对话', '多语言支持'],
        pricing: { free: true, priceDescription: "基础功能免费，高级功能订阅" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Krea AI",
        description: "专注于创意设计的AI图像生成平台，提供多种艺术风格和模板。",
        category_id: categoryMap['图像生成'],
        image_url: "https://www.krea.ai/favicon.ico",
        official_url: "https://www.krea.ai",
        features: ['多风格图像生成', '设计模板', '创意社区', '高分辨率输出'],
        pricing: { free: true, priceDescription: "有限免费版，创作者计划每月订阅" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "NVIDIA Canvas",
        description: "NVIDIA开发的AI绘画工具，能将简单的涂鸦转换为逼真的风景图像。",
        category_id: categoryMap['图像生成'],
        image_url: "https://www.nvidia.com/content/dam/en-zz/Solutions/gtc/nvidia-logo-vert-rgb-blk-for-screen.jpg",
        official_url: "https://www.nvidia.com/en-us/studio/canvas/",
        features: ['涂鸦转真实图像', 'NVIDIA RTX支持', '多种风景类型', '实时渲染'],
        pricing: { free: true, priceDescription: "免费使用，需要RTX GPU" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Murf AI",
        description: "专业级AI语音生成器，可创建自然逼真的配音和语音内容。",
        category_id: categoryMap['音频处理'],
        image_url: "https://murf.ai/favicon.ico",
        official_url: "https://murf.ai",
        features: ['100+AI语音', '多语言支持', '音调和重音调整', '团队协作'],
        pricing: { free: true, priceDescription: "免费试用，付费计划起价每月19美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      }
    ];
    
    // 批量创建产品
    const createdProducts = await Product.bulkCreate(productsData, { transaction });
    
    logger.info(`成功添加15个新产品(第1部分)`, { service: 'agistar-api' });
    
    // 提交事务
    await transaction.commit();
    logger.info('第1部分产品添加完成', { service: 'agistar-api' });
    
    return { success: true, count: createdProducts.length };
    
  } catch (error) {
    // 回滚事务
    await transaction.rollback();
    logger.error('添加产品失败:', error, { service: 'agistar-api' });
    return { success: false, error: error.message };
  }
}

// 执行函数
add50Products()
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