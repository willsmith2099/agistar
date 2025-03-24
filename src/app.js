/**
 * AGIStar 后端服务主入口文件
 * @author AGIStar Team
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// 创建Express应用实例
const app = express();

// 中间件配置
app.use(helmet({
  contentSecurityPolicy: false // 允许加载外部资源
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// API路由
app.use('/api/v1', routes);

// 前端路由 - 所有前端路由都返回index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    // 数据库连接
    await sequelize.authenticate();
    logger.info('数据库连接成功');
    
    logger.info(`服务器运行在端口 ${PORT}`);
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}); 