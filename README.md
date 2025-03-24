# AGIStar 后端服务

AGIStar是一个AI产品排行榜平台，帮助用户发现和评估最新的AI工具和服务。

## 技术栈

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT认证
- Winston日志

## 开发环境配置

### 先决条件

- Node.js 14+
- MySQL 5.7+

### 安装依赖

```bash
npm install
```

### 环境变量配置

1. 复制环境变量示例文件
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置数据库连接信息和JWT密钥

### 初始化数据库

```bash
npm run init-db
```

### 启动开发服务器

```bash
npm run dev
```

服务器默认在 http://localhost:3000 运行。API基础路径为 `/api/v1`。

## API文档

详细的API文档请参考 [api-docs.md](api-docs.md)。

## 项目结构

```
src/
├── app.js              # 应用入口文件
├── config/             # 配置文件
├── controllers/        # 控制器
├── middlewares/        # 中间件
├── models/             # 数据模型
├── routes/             # 路由定义
├── scripts/            # 脚本工具
└── utils/              # 工具函数
```

## 功能特性

- 用户认证（注册/登录）
- AI产品分类与管理
- 产品评分与评价
- 分页与排序
- 数据验证

## 生产环境部署

1. 安装依赖
```bash
npm install --production
```

2. 设置环境变量
```bash
export NODE_ENV=production
export PORT=3000
export DB_HOST=your_db_host
export DB_USER=your_db_user
export DB_PASSWORD=your_db_password
export DB_NAME=agistar
export JWT_SECRET=your_jwt_secret
```

3. 启动服务
```bash
npm start
```

建议使用PM2等进程管理工具来管理Node.js应用。

## 授权协议

MIT
