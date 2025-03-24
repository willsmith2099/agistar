/**
 * 日志工具
 * @module utils/logger
 */

const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'agistar-api' },
  transports: [
    // 开发环境输出到控制台
    process.env.NODE_ENV !== 'production'
      ? new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      : null,
    // 生产环境写入文件
    process.env.NODE_ENV === 'production'
      ? new winston.transports.File({
          filename: path.join(__dirname, '../../logs/error.log'),
          level: 'error'
        })
      : null,
    process.env.NODE_ENV === 'production'
      ? new winston.transports.File({
          filename: path.join(__dirname, '../../logs/combined.log')
        })
      : null
  ].filter(Boolean)
});

module.exports = logger; 