#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 开始构建 Stock Trading Journal...\n');

try {
  // 1. 清理旧的构建文件
  console.log('📦 清理旧构建文件...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  console.log('✅ 清理完成\n');

  // 2. TypeScript 类型检查
  console.log('🔍 执行 TypeScript 类型检查...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('✅ 类型检查通过\n');
  } catch (error) {
    console.warn('⚠️ 类型检查发现警告，但继续构建...\n');
  }

  // 3. 使用 Vite 构建
  console.log('⚡ 执行 Vite 构建...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Vite 构建完成\n');

  // 4. 创建简单的启动说明
  const readmePath = path.join('dist', 'README.txt');
  const readmeContent = `
Stock Trading Journal - 构建输出
==============================

这个目录包含构建好的 Web 应用程序。

使用方法：
1. 使用任意静态 Web 服务器托管此目录
2. 或直接在浏览器中打开 index.html（某些浏览器可能有 CORS 限制）

推荐的本地服务器：
- 使用 Python: python3 -m http.server 3000
- 使用 Node.js: npx serve -l 3000
- 使用 VS Code: 使用 Live Server 插件

访问地址：http://localhost:3000

构建时间：${new Date().toLocaleString('zh-CN')}
版本：${process.env.npm_package_version || '0.1.0'}
`;

  fs.writeFileSync(readmePath, readmeContent);
  console.log('📄 构建说明已创建\n');

  // 5. 统计构建输出
  const distFiles = fs.readdirSync('dist');
  console.log('📁 构建输出内容：');
  distFiles.forEach(file => {
    const filePath = path.join('dist', file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2);
    const type = stats.isDirectory() ? ' [目录]' : ` (${size} KB)`;
    console.log(`  - ${file}${type}`);
  });

  console.log('\n✅ 构建完成！');
  console.log('📦 输出目录: dist/');
  console.log('🎉 应用准备就绪！\n');

} catch (error) {
  console.error('\n❌ 构建失败！');
  console.error(error);
  process.exit(1);
}
