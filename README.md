# Dropit 🚀

[English](#english) | [中文](#中文)

---

## 中文

### 📖 项目简介

**Dropit** 是一个安全的临时文件分享服务，提供密码保护的文件上传和文本分享功能。采用现代化的聊天界面设计，支持多种文件格式，具备完善的复制、下载和管理功能。

### ✨ 主要功能

- 🔐 **安全认证** - JWT令牌 + 密码保护访问
- 📁 **多格式支持** - 图片、PDF、文档、视频、音频等多种文件格式
- 💬 **聊天界面** - 类似聊天应用的现代化用户界面
- 📋 **复制功能** - 一键复制文本内容或文件链接
- ⬇️ **直接下载** - 点击即可下载文件到本地
- 🗂️ **文件管理** - 完整的文件管理器，支持搜索、筛选、批量操作
- 🎨 **现代UI** - 暗色主题，流畅动画和视觉反馈
- 📱 **响应式** - 支持桌面端和移动端

### 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router) + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand + SWR
- **认证**: JWT + bcryptjs
- **文件存储**: Vercel Blob
- **数据存储**: Vercel KV (Redis兼容)
- **表单处理**: React Hook Form
- **图标**: Lucide React

### 🚀 快速开始

#### 1. 安装依赖

```bash
npm install
# 或
yarn install
```

#### 2. 环境配置

创建 `.env.local` 文件（可选，有默认值）：

```env
# JWT 密钥（可选，默认: your-secret-key）
JWT_SECRET=your-jwt-secret-key

# 应用密码（可选，默认: default-password）
APP_PASSWORD=your-app-password

# Vercel Blob 存储（生产环境需要）
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Vercel KV 存储（生产环境需要）
KV_REST_API_URL=your-vercel-kv-url
KV_REST_API_TOKEN=your-vercel-kv-token
```

#### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

#### 4. 登录使用

- 默认密码：`default-password`（如未设置环境变量）
- 输入密码后即可开始使用所有功能

### 📝 使用指南

#### 基本操作

1. **认证登录** - 输入正确密码进入应用
2. **发送文本** - 在底部输入框输入文本，按Enter发送
3. **上传文件** - 点击上传按钮或拖拽文件到聊天区域
4. **复制内容** - 悬停消息后点击复制按钮
5. **下载文件** - 点击文件消息上的下载按钮

#### 文件管理器

- 点击顶部的文件夹图标打开文件管理器
- 支持网格视图和列表视图切换
- 可按名称、日期、大小、类型排序
- 支持文件类型筛选（图片、文档、视频等）
- 支持搜索和批量删除操作

#### 支持的文件格式

- **图片**: JPEG, PNG, GIF, WebP
- **文档**: PDF, DOC, DOCX, TXT  
- **视频**: MP4, WebM
- **音频**: MP3, WAV
- **压缩**: ZIP, RAR

### 🛠️ 开发命令

```bash
# 开发
npm run dev          # 启动开发服务器（使用 Turbopack）
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 代码质量
npm run lint         # ESLint 检查
npm run lint:fix     # 自动修复 ESLint 问题
npm run type-check   # TypeScript 类型检查
npm run format       # Prettier 格式化
npm run format:check # 检查代码格式

# 测试
npm test             # 运行 Jest 单元测试
npm run test:watch   # 监视模式运行测试
npm run test:e2e     # 运行 Playwright 端到端测试
npm run test:coverage # 生成测试覆盖率报告

# 其他
npm run analyze      # 分析包大小
```

### 📁 项目结构

```
dropit/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/         # 认证接口
│   │   ├── content/      # 内容管理接口
│   │   └── upload/       # 文件上传接口
│   ├── page.tsx          # 主页面
│   └── layout.tsx        # 布局组件
├── components/            # React 组件
│   ├── AuthForm.tsx      # 认证表单
│   ├── ChatMessage.tsx   # 消息组件
│   ├── ChatInput.tsx     # 输入组件
│   ├── FileManager.tsx   # 文件管理器
│   └── ...               # 其他组件
├── lib/                  # 工具库
│   ├── auth.ts          # 认证工具
│   ├── storage.ts       # 存储适配器
│   └── utils.ts         # 通用工具
└── public/              # 静态资源
```

### 🔒 安全特性

- 密码保护访问
- JWT 令牌认证
- 文件类型验证
- 文件大小限制（10MB）
- 内容安全策略（CSP）头部配置
- 跨站请求保护

---

## English

### 📖 Project Overview

**Dropit** is a secure temporary file sharing service with password-protected file upload and text sharing capabilities. Features a modern chat-like interface supporting multiple file formats with comprehensive copy, download, and management functionality.

### ✨ Key Features

- 🔐 **Secure Authentication** - JWT tokens + password protection
- 📁 **Multi-format Support** - Images, PDFs, documents, videos, audio, and more
- 💬 **Chat Interface** - Modern chat-like user interface
- 📋 **Copy Functionality** - One-click copy for text content or file URLs
- ⬇️ **Direct Download** - Click to download files directly
- 🗂️ **File Management** - Complete file manager with search, filtering, and bulk operations
- 🎨 **Modern UI** - Dark theme with smooth animations and visual feedback
- 📱 **Responsive** - Works on desktop and mobile devices

### 🛠️ Tech Stack

- **Frontend Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + SWR
- **Authentication**: JWT + bcryptjs
- **File Storage**: Vercel Blob
- **Data Storage**: Vercel KV (Redis-compatible)
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

### 🚀 Quick Start

#### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 2. Environment Configuration

Create `.env.local` file (optional, has defaults):

```env
# JWT Secret (optional, default: your-secret-key)
JWT_SECRET=your-jwt-secret-key

# App Password (optional, default: default-password)
APP_PASSWORD=your-app-password

# Vercel Blob Storage (required for production)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Vercel KV Storage (required for production)
KV_REST_API_URL=your-vercel-kv-url
KV_REST_API_TOKEN=your-vercel-kv-token
```

#### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

#### 4. Login and Use

- Default password: `default-password` (if no environment variable set)
- Enter the password to access all features

### 📝 Usage Guide

#### Basic Operations

1. **Authentication** - Enter correct password to access the application
2. **Send Text** - Type in the bottom input field, press Enter to send
3. **Upload Files** - Click upload button or drag files to chat area
4. **Copy Content** - Hover over messages and click copy button
5. **Download Files** - Click download button on file messages

#### File Manager

- Click the folder icon in the top bar to open file manager
- Switch between grid view and list view
- Sort by name, date, size, or type
- Filter by file type (images, documents, videos, etc.)
- Search and bulk delete operations

#### Supported File Formats

- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, TXT
- **Videos**: MP4, WebM
- **Audio**: MP3, WAV
- **Archives**: ZIP, RAR

### 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server (with Turbopack)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier
npm run format:check # Check code formatting

# Testing
npm test             # Run Jest unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright end-to-end tests
npm run test:coverage # Generate test coverage report

# Other
npm run analyze      # Analyze bundle size
```

### 📁 Project Structure

```
dropit/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── content/      # Content management endpoints
│   │   └── upload/       # File upload endpoints
│   ├── page.tsx          # Main page
│   └── layout.tsx        # Layout component
├── components/            # React components
│   ├── AuthForm.tsx      # Authentication form
│   ├── ChatMessage.tsx   # Message component
│   ├── ChatInput.tsx     # Input component
│   ├── FileManager.tsx   # File manager
│   └── ...               # Other components
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── storage.ts       # Storage adapter
│   └── utils.ts         # General utilities
└── public/              # Static assets
```

### 🔒 Security Features

- Password-protected access
- JWT token authentication
- File type validation
- File size limits (10MB)
- Content Security Policy (CSP) headers
- Cross-site request protection

### 📄 License

This project is private and proprietary.

### 🤝 Contributing

This is a private project. Please contact the maintainers for contribution guidelines.

---

**Dropit** - Secure, Simple, Fast File Sharing 🚀