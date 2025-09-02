/** @type {import('next').NextConfig} */
const nextConfig = {
  // 输出模式配置，优化 Serverless 部署
  output: 'standalone',
  
  // 实验性功能
  experimental: {},

  // Turbopack 配置
  turbo: {},

  // 图片优化配置
  images: {
    // 允许的图片域名
    domains: [],
    // 图片格式优化
    formats: ['image/webp', 'image/avif'],
    // 图片尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 安全头配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https:; font-src 'self' data:;",
          },
        ],
      },
    ]
  },

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 重定向配置
  async redirects() {
    return []
  },

  // 重写配置
  async rewrites() {
    return []
  },

  // 压缩配置
  compress: true,

  // 缓存配置
  cacheHandler: undefined,

  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint 配置
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Webpack 配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 自定义 webpack 配置
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },

  // 性能配置
  poweredByHeader: false,
  reactStrictMode: true,
  
  // 打包分析
  // 如需启用包分析，取消下面的注释并运行 npm run analyze
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
};

export default nextConfig;
