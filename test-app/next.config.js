/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 确保输出正确
  // 明确指定输出目录
  distDir: '.next',
}

module.exports = nextConfig

