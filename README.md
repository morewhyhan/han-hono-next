# Han-Hono-Next

## 技术栈

- **前端**：Next.js 14 (App Router) + React 18
- **后端**：Hono  
- **数据库**：SQLite 
- **ORM**：Prisma
- **样式**：Tailwind CSS + Shadcn UI
- **编程语言**：TypeScript

## 快速开始：

```bash
### 克隆项目
git clone https://github.com/morewhyhan/han-hono-next.git
cd han-hono-next

### 安装依赖
npm install

### 数据库迁移
npx prisma migrate dev

### 启动开发服务器
npm run dev
```

访问: http://localhost:3000

---

基于 Next.js、Hono 和 Prisma 的全栈应用模板

## 🚀 Vercel 部署指南

### 准备工作
1. 确保代码已推送到 GitHub 仓库
2. 已创建 `.env.production` 和 `vercel.json` 配置文件

### 部署步骤
1. 登录 [Vercel](https://vercel.com) 账号
2. 点击「New Project」
3. 导入你的 GitHub 仓库（`han-hono-next`）
4. 在「Environment Variables」部分添加以下环境变量：
   - `DATABASE_URL`：设置为你的生产数据库连接字符串
5. 保持默认的构建和输出设置
6. 点击「Deploy」开始部署

### 注意事项
- 如果使用 SQLite，在 Vercel 上可能需要切换到 PostgreSQL 等支持的数据库
- 部署后，Vercel 会自动为你提供一个域名访问应用


