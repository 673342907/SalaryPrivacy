export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🚀 Vercel 测试应用</h1>
      <p>如果你看到这个页面，说明 Vercel 部署成功了！</p>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>✅ 部署成功</h2>
        <p>这是一个简单的 Next.js 测试应用，用于验证 Vercel 部署配置。</p>
        <p>当前时间: {new Date().toLocaleString('zh-CN')}</p>
      </div>
    </main>
  )
}

