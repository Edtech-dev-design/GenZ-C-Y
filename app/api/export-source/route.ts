import path from 'path';
import fs from 'fs';
import { PassThrough } from 'stream';

const { ZipArchive } = require('archiver');

export async function GET() {
  try {
    const archive = new ZipArchive({ zlib: { level: 9 } });
    const passThrough = new PassThrough();

    archive.pipe(passThrough);

    const rootDir = process.cwd();

    // Append directories
    archive.directory(path.join(rootDir, 'app'), 'app');
    archive.directory(path.join(rootDir, 'components'), 'components');
    archive.directory(path.join(rootDir, 'lib'), 'lib');
    if (fs.existsSync(path.join(rootDir, 'public'))) {
      archive.directory(path.join(rootDir, 'public'), 'public');
    }

    // Append individual configuration files
    const rootFiles = [
      'package.json',
      'tsconfig.json',
      'postcss.config.mjs',
      'next.config.ts',
      '.env.example'
    ];

    for (const file of rootFiles) {
      const fullPath = path.join(rootDir, file);
      if (fs.existsSync(fullPath)) {
        archive.file(fullPath, { name: file });
      }
    }

    // Add README.md with clear setup instructions
    const readmeContent = `# VIỆT PHỤC REMIX — Sáng Tạo Nét Xưa, Định Hình Phong Cách Người Trẻ

Dự án tương tác phối trang phục truyền thống Việt Nam (Áo Ngũ Thân, Nhật Bình, Tứ Thân, Lemur) kết hợp phong cách đường phố đương đại, bảng màu Ngũ Hành và Cảnh báo Lệch Chuẩn văn hóa (Cultural Guardrails).

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy Local

### 1. Cài đặt dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Cấu hình biến môi trường
Tạo file \`.env.local\` ở thư mục gốc (nếu dùng tính năng Cố vấn AI Gemini):
\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

### 3. Chạy máy chủ phát triển (Development Server)
\`\`\`bash
npm run dev
\`\`\`
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

### 4. Đóng gói cho Production
\`\`\`bash
npm run build
npm run start
\`\`\`

## 📂 Cấu Trúc Dự Án
- \`app/\`: Next.js 15 App Router & API routes.
- \`components/\`: Sàn diễn đồ họa (GarmentGraphicsEngine), Avatar Canvas (AvatarVisualizer), Bảng màu Ngũ Hành, Lookbook Modal, Cố vấn AI.
- \`lib/heritage-data.ts\`: Toàn bộ dữ liệu phục sức di sản, chi tiết giải phẫu học, bối cảnh văn hóa và thuật toán Harmony Score.
`;
    archive.append(readmeContent, { name: 'README.md' });

    const chunks: Buffer[] = [];
    passThrough.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

    await new Promise<void>((resolve, reject) => {
      passThrough.on('end', () => resolve());
      passThrough.on('error', (err) => reject(err));
      archive.on('error', (err: any) => reject(err));
      archive.finalize();
    });

    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="viet-phuc-remix-source.zip"',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
