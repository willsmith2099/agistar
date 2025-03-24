# AGIStar API 接口文档

## 基础信息
- 基础路径: `/api/v1`
- 响应格式: JSON
- 认证方式: Bearer Token

## 接口列表

### 1. 产品相关接口

#### 1.1 获取产品列表
- 请求路径：`GET /products`
- 请求参数：
  ```json
  {
    "page": "页码，默认1",
    "pageSize": "每页数量，默认10",
    "category": "分类ID，可选",
    "sortBy": "排序字段(rating/createTime)，可选",
    "sortOrder": "排序方向(asc/desc)，可选"
  }
  ```
- 响应示例：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": 100,
      "items": [
        {
          "id": 1,
          "name": "ChatGPT",
          "description": "领先的对话式AI助手",
          "category": "对话AI",
          "rating": 9.8,
          "imageUrl": "https://example.com/chatgpt.jpg",
          "officialUrl": "https://chat.openai.com",
          "createTime": "2024-03-23 12:00:00",
          "updateTime": "2024-03-23 12:00:00"
        }
      ]
    }
  }
  ```

#### 1.2 获取产品详情
- 请求路径：`GET /products/{id}`
- 响应示例：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "name": "ChatGPT",
      "description": "领先的对话式AI助手",
      "category": "对话AI",
      "rating": 9.8,
      "imageUrl": "https://example.com/chatgpt.jpg",
      "officialUrl": "https://chat.openai.com",
      "features": ["多语言支持", "代码生成", "文本分析"],
      "pricing": {
        "free": true,
        "priceDescription": "基础版免费，Plus版20美元/月"
      },
      "createTime": "2024-03-23 12:00:00",
      "updateTime": "2024-03-23 12:00:00"
    }
  }
  ```

#### 1.3 添加产品评分
- 请求路径：`POST /products/{id}/ratings`
- 请求参数：
  ```json
  {
    "score": "评分(1-10)",
    "comment": "评价内容",
    "userId": "用户ID"
  }
  ```
- 响应示例：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "productId": 1,
      "score": 9.5,
      "comment": "非常好用的AI助手",
      "createTime": "2024-03-23 12:00:00"
    }
  }
  ```

### 2. 分类相关接口

#### 2.1 获取分类列表
- 请求路径：`GET /categories`
- 响应示例：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 1,
        "name": "对话AI",
        "description": "智能对话助手类产品",
        "productCount": 10
      }
    ]
  }
  ```

### 3. 用户相关接口

#### 3.1 用户注册
- 请求路径：`POST /users/register`
- 请求参数：
  ```json
  {
    "username": "用户名",
    "email": "邮箱",
    "password": "密码"
  }
  ```
- 响应示例：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "username": "user123",
      "email": "user@example.com",
      "createTime": "2024-03-23 12:00:00"
    }
  }
  ```

#### 3.2 用户登录
- 请求路径：`POST /users/login`
- 请求参数：
  ```json
  {
    "email": "邮箱",
    "password": "密码"
  }
  ```
- 响应示例：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": 1,
        "username": "user123",
        "email": "user@example.com"
      }
    }
  }
  ```

## 错误码说明
- 200: 成功
- 400: 请求参数错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器内部错误 