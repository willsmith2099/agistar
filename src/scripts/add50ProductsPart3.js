/**
 * 添加50个热门AI产品到数据库(第3部分)
 * @module scripts/add50ProductsPart3
 */

require('dotenv').config();
const { Product, Category, sequelize } = require('../models');
const logger = require('../utils/logger');

/**
 * 添加第三批热门AI产品
 * @async
 */
async function add50ProductsPart3() {
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
    
    // 如果数据库中没有这些分类，添加它们
    if (!categoryMap['开发工具']) {
      const newCategory = await Category.create({
        name: '开发工具',
        description: '用于开发人员的AI工具和框架',
        status: 1
      }, { transaction });
      categoryMap['开发工具'] = newCategory.id;
    }
    
    if (!categoryMap['商业智能']) {
      const newCategory = await Category.create({
        name: '商业智能',
        description: '用于商业数据分析和决策的AI工具',
        status: 1
      }, { transaction });
      categoryMap['商业智能'] = newCategory.id;
    }
    
    // 定义第三批AI产品 (产品31-50)
    const productsData = [
      {
        name: "DeepL",
        description: "基于深度学习的翻译服务，提供超过25种语言的高质量翻译。",
        category_id: categoryMap['翻译工具'],
        image_url: "https://static.deepl.com/img/favicon/favicon_32.png",
        official_url: "https://www.deepl.com",
        features: ['高质量翻译', '25+语言', '专业领域支持', '文档翻译'],
        pricing: { free: true, priceDescription: "免费版有字数限制，Pro版每月起价" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Lexica",
        description: "Stable Diffusion图像的搜索引擎和生成工具，提供数百万AI生成图像的搜索。",
        category_id: categoryMap['图像生成'],
        image_url: "https://lexica.art/favicon.ico",
        official_url: "https://lexica.art",
        features: ['图像搜索', 'AI图像生成', '提示词工程', '风格探索'],
        pricing: { free: true, priceDescription: "基础功能免费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Caktus AI",
        description: "专为学生设计的AI学习助手，帮助解决问题和提供教育资源。",
        category_id: categoryMap['教育辅助'],
        image_url: "https://www.caktus.ai/favicon.ico",
        official_url: "https://www.caktus.ai",
        features: ['学习助手', '写作辅助', '问题解答', '教育资源'],
        pricing: { free: true, priceDescription: "免费版和订阅版" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Microsoft Copilot",
        description: "微软基于AI的个人助手，集成在Windows、Edge和Office产品中。",
        category_id: categoryMap['多模态AI'],
        image_url: "https://www.microsoft.com/favicon.ico",
        official_url: "https://copilot.microsoft.com",
        features: ['个人助手', 'Office集成', '内容生成', '多任务处理'],
        pricing: { free: true, priceDescription: "基础功能免费，高级功能需订阅" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Cohere",
        description: "专注于NLP的AI平台，提供文本生成、嵌入和分类API。",
        category_id: categoryMap['开发工具'],
        image_url: "https://cohere.ai/favicon.ico",
        official_url: "https://cohere.ai",
        features: ['文本生成', '语义搜索', 'LLM API', '多语言支持'],
        pricing: { free: true, priceDescription: "初创公司特别定价，企业版定制" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Hugging Face",
        description: "开源AI社区和平台，提供数千个预训练模型和数据集。",
        category_id: categoryMap['开发工具'],
        image_url: "https://huggingface.co/favicon.ico",
        official_url: "https://huggingface.co",
        features: ['模型库', '数据集', '在线演示', '社区协作'],
        pricing: { free: true, priceDescription: "开源免费，企业版收费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Lensa",
        description: "使用AI的照片编辑应用，可以生成艺术风格的头像和增强照片。",
        category_id: categoryMap['图像生成'],
        image_url: "https://prisma-ai.com/favicon.ico",
        official_url: "https://prisma-ai.com/lensa",
        features: ['AI头像生成', '照片增强', '背景移除', '滤镜效果'],
        pricing: { free: true, priceDescription: "基本功能免费，订阅解锁高级功能" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Otter.ai",
        description: "AI语音转文字和会议记录工具，自动记录和总结会议内容。",
        category_id: categoryMap['音频处理'],
        image_url: "https://otter.ai/favicon.ico",
        official_url: "https://otter.ai",
        features: ['实时转录', '会议记录', '内容搜索', '高亮重点'],
        pricing: { free: true, priceDescription: "基础版免费，专业版每月月费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "StabilityAI",
        description: "Stable Diffusion背后的公司，提供开源和商业AI图像生成工具。",
        category_id: categoryMap['图像生成'],
        image_url: "https://stability.ai/favicon.ico",
        official_url: "https://stability.ai",
        features: ['开源模型', '图像生成API', '研究工具', '社区支持'],
        pricing: { free: true, priceDescription: "部分功能免费，API收费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "SlidesAI",
        description: "用AI自动生成精美的PowerPoint演示文稿，节省制作时间。",
        category_id: categoryMap['内容创作'],
        image_url: "https://www.slidesai.io/favicon.ico",
        official_url: "https://www.slidesai.io",
        features: ['自动演示生成', '主题定制', 'Google Slides集成', '内容布局优化'],
        pricing: { free: true, priceDescription: "基础版免费，高级版月费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Gamma",
        description: "AI驱动的演示文稿和文档创建工具，一键生成专业内容。",
        category_id: categoryMap['内容创作'],
        image_url: "https://gamma.app/favicon.ico",
        official_url: "https://gamma.app",
        features: ['AI文档生成', '演示文稿创建', '网页发布', '团队协作'],
        pricing: { free: true, priceDescription: "基础版免费，专业版每月订阅" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "D-ID",
        description: "AI数字人生成平台，可创建会说话的头像和数字分身。",
        category_id: categoryMap['视频生成'],
        image_url: "https://www.d-id.com/favicon.ico",
        official_url: "https://www.d-id.com",
        features: ['数字人生成', '文本到视频', '个性化头像', '企业应用'],
        pricing: { free: true, priceDescription: "免费试用，付费计划按用量收费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Quillbot",
        description: "AI驱动的改写和语法检查工具，帮助提升写作质量。",
        category_id: categoryMap['内容创作'],
        image_url: "https://quillbot.com/favicon.ico",
        official_url: "https://quillbot.com",
        features: ['内容改写', '语法检查', '摘要生成', '多种写作模式'],
        pricing: { free: true, priceDescription: "基础功能免费，高级功能订阅" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Beautiful.ai",
        description: "智能演示设计平台，使用AI自动调整布局和设计元素。",
        category_id: categoryMap['内容创作'],
        image_url: "https://www.beautiful.ai/favicon.ico",
        official_url: "https://www.beautiful.ai",
        features: ['智能设计', '模板库', '团队协作', '演示分析'],
        pricing: { free: true, priceDescription: "免费试用，专业版每月月费" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "DALL-E 3",
        description: "OpenAI最新的图像生成模型，提供更精确的文本到图像转换能力。",
        category_id: categoryMap['图像生成'],
        image_url: "https://openai.com/content/images/2022/05/openai-avatar.png",
        official_url: "https://openai.com/dall-e-3",
        features: ['高精度图像生成', '文本理解增强', 'ChatGPT集成', '商业使用权限'],
        pricing: { free: false, priceDescription: "通过ChatGPT Plus或API使用" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Zapier AI",
        description: "在Zapier自动化平台中集成的AI助手，帮助创建工作流和内容。",
        category_id: categoryMap['多模态AI'],
        image_url: "https://zapier.com/favicon.ico",
        official_url: "https://zapier.com/ai",
        features: ['自动化助手', '内容生成', '工作流优化', '跨平台集成'],
        pricing: { free: false, priceDescription: "作为Zapier订阅的一部分" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Writesonic",
        description: "AI文案和内容创作平台，生成销售文案、博客和广告。",
        category_id: categoryMap['内容创作'],
        image_url: "https://writesonic.com/favicon.ico",
        official_url: "https://writesonic.com",
        features: ['内容创作', '商业文案', '博客生成', '多语言支持'],
        pricing: { free: true, priceDescription: "免费试用，基于字数的订阅计划" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Claude",
        description: "Anthropic开发的对话式AI助手，专注于有益、诚实和无害的回答。",
        category_id: categoryMap['对话AI'],
        image_url: "https://anthropic.com/favicon.ico",
        official_url: "https://www.anthropic.com/claude",
        features: ['语境理解', '安全架构', '长文本处理', '有用的助手'],
        pricing: { free: true, priceDescription: "基础版免费，Claude Pro订阅" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "Midjourney",
        description: "AI艺术和图像生成服务，创建高质量的艺术风格图像。",
        category_id: categoryMap['图像生成'],
        image_url: "https://www.midjourney.com/favicon.ico",
        official_url: "https://www.midjourney.com",
        features: ['艺术风格', '高质量图像', 'Discord集成', '创意社区'],
        pricing: { free: false, priceDescription: "付费订阅，多个价格等级" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      },
      {
        name: "GitHub Copilot",
        description: "GitHub与OpenAI合作开发的AI编程助手，提供代码建议。",
        category_id: categoryMap['代码助手'],
        image_url: "https://github.githubassets.com/favicons/favicon.png",
        official_url: "https://github.com/features/copilot",
        features: ['代码生成', '实时建议', '多语言支持', 'IDE集成'],
        pricing: { free: false, priceDescription: "个人每月10美元，团队每月19美元" },
        rating: 5.0,
        rating_count: 100,
        status: 1
      }
    ];
    
    // 批量创建产品
    const createdProducts = await Product.bulkCreate(productsData, { transaction });
    
    logger.info(`成功添加20个新产品(第3部分)`, { service: 'agistar-api' });
    
    // 提交事务
    await transaction.commit();
    logger.info('第3部分产品添加完成', { service: 'agistar-api' });
    
    return { success: true, count: createdProducts.length };
    
  } catch (error) {
    // 回滚事务
    await transaction.rollback();
    logger.error('添加产品失败:', error, { service: 'agistar-api' });
    return { success: false, error: error.message };
  }
}

// 执行函数
add50ProductsPart3()
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