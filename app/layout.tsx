import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'VIỆT PHỤC REMIX — Sáng Tạo Nét Xưa, Định Hình Phong Cách Người Trẻ',
  description: 'Studio thời trang tương tác phối trang phục truyền thống Việt Nam (Áo Ngũ Thân, Nhật Bình, Tứ Thân, Lemur) kết hợp phong cách đường phố Gen Z, bảng màu Ngũ Hành và Cảnh báo Lệch Chuẩn văn hóa.',
  openGraph: {
    title: 'VIỆT PHỤC REMIX — Sáng Tạo Nét Xưa, Định Hình Phong Cách Người Trẻ',
    description: 'Studio thời trang tương tác phối trang phục truyền thống Việt Nam kết hợp phong cách đường phố Gen Z.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIỆT PHỤC REMIX — Sáng Tạo Nét Xưa, Định Hình Phong Cách Người Trẻ',
    description: 'Studio thời trang tương tác phối trang phục truyền thống Việt Nam kết hợp phong cách đường phố Gen Z.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
