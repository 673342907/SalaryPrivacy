import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vercel 测试应用',
  description: '简单的 Next.js 测试应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

