import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    // 允许导入.ts文件，解决Prisma客户端模块导入问题
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx']
    
    // 为Prisma客户端生成的模块添加别名解析
    config.resolve.alias = {
      ...config.resolve.alias,
      '../../generated/prisma': '/Users/zhaohuan/Desktop/han-hono-next/generated/prisma',
    }
    
    return config
  },
  experimental: {
    // 确保Prisma客户端生成的代码能被正确处理
    esmExternals: true,
  },
}

export default nextConfig
