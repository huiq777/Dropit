# Dropit 部署指南

## Vercel 部署配置

### 1. 环境变量配置

在 Vercel Dashboard 中配置以下环境变量：

#### 必需环境变量

```bash
# 应用访问密码
APP_PASSWORD=your-secure-password

# JWT 密钥（建议使用 openssl rand -base64 32 生成）
JWT_SECRET=your-strong-jwt-secret-key

# Vercel KV 数据库
VERCEL_KV_REST_API_URL=https://your-kv-url.kv.vercel-storage.com
VERCEL_KV_REST_API_TOKEN=your-kv-token

# Vercel Blob 存储
VERCEL_BLOB_READ_WRITE_TOKEN=your-blob-token
```

### 2. Vercel 数据库设置

#### 创建 KV 数据库
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入 Storage 页面
3. 创建新的 KV Database
4. 复制 REST API URL 和 Token

#### 创建 Blob 存储
1. 在 Storage 页面创建新的 Blob Store
2. 复制 Read/Write Token

### 3. 部署步骤

#### 方法一：GitHub 集成（推荐）
1. 将代码推送到 GitHub
2. 在 Vercel 中连接 GitHub 仓库
3. 配置环境变量
4. 自动部署

#### 方法二：CLI 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel --prod
```

### 4. 域名配置

#### 自定义域名
1. 在 Vercel Dashboard 的项目设置中
2. 添加自定义域名
3. 配置 DNS 记录

#### SSL 证书
Vercel 自动提供 Let's Encrypt SSL 证书

### 5. 监控和日志

#### 性能监控
- 使用 Vercel Analytics
- 配置 Web Vitals 监控

#### 日志查看
```bash
# 查看函数日志
vercel logs [deployment-url]

# 实时日志
vercel logs --follow
```

## 环境变量说明

### 安全配置

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `APP_PASSWORD` | 应用访问密码 | `MySecurePassword123!` |
| `JWT_SECRET` | JWT 签名密钥 | `abc123...` (建议32字符以上) |

### 数据库配置

| 变量名 | 描述 | 获取方式 |
|--------|------|----------|
| `VERCEL_KV_REST_API_URL` | KV 数据库 API 地址 | Vercel Storage 页面 |
| `VERCEL_KV_REST_API_TOKEN` | KV 数据库访问令牌 | Vercel Storage 页面 |
| `VERCEL_BLOB_READ_WRITE_TOKEN` | Blob 存储访问令牌 | Vercel Storage 页面 |

### 可选配置

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |

## 部署检查清单

### 部署前检查
- [ ] 所有必需环境变量已配置
- [ ] KV 数据库已创建并连接
- [ ] Blob 存储已创建并连接
- [ ] 代码已推送到 Git 仓库
- [ ] 本地构建测试通过

### 部署后验证
- [ ] 应用可以正常访问
- [ ] 密码验证功能正常
- [ ] 文本保存和读取功能正常
- [ ] 文件上传功能正常
- [ ] API 响应正常
- [ ] 错误页面显示正确

## 故障排除

### 常见问题

#### 1. 环境变量未生效
- 检查变量名拼写
- 重新部署应用
- 检查 Vercel Dashboard 配置

#### 2. KV 连接失败
- 确认 KV URL 和 Token 正确
- 检查 KV 数据库状态
- 验证网络连接

#### 3. Blob 上传失败
- 检查 Blob Token 配置
- 验证文件大小限制
- 检查文件类型限制

#### 4. 构建失败
```bash
# 本地测试构建
npm run build

# 检查 TypeScript 类型
npx tsc --noEmit

# 检查 ESLint
npm run lint
```

### 日志分析
```bash
# 查看最近的部署日志
vercel logs

# 查看特定函数的日志
vercel logs --function=api/auth

# 实时监控
vercel logs --follow
```

## 性能优化建议

### 1. 缓存策略
- 静态资源缓存
- API 响应缓存
- 数据库查询优化

### 2. 安全优化
- 定期更新依赖
- 配置 CSP 头
- 启用 HTTPS 重定向

### 3. 监控告警
- 配置错误告警
- 性能监控
- 使用量监控

## 备份和恢复

### 数据备份
- KV 数据定期导出
- Blob 文件备份
- 配置文件备份

### 灾难恢复
- 多区域部署
- 数据恢复流程
- 应急联系方式