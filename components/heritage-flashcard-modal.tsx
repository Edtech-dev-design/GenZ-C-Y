'use client';

import React from 'react';
import { X, BookOpen, Sparkles, Feather, Compass, MapPin } from 'lucide-react';

interface FlashcardData {
  id: string;
  title: string;
  subtitle: string;
  meaning: string;
  historicalContext: string;
  fabricOrigin?: string;
  location?: string;
  culturalLesson: string;
}

const FLASHCARDS_REGISTRY: Record<string, FlashcardData> = {
  lap_linh_collar: {
    id: 'lap_linh_collar',
    title: 'Cổ Áo Lập Lĩnh (Cổ Đứng Tròn)',
    subtitle: 'Đặc trưng cốt lõi của Áo Ngũ Thân thời Nguyễn',
    meaning: 'Cổ đứng tròn ôm khít chân cổ, thường cao 2-3cm, may lót cứng cáp bằng vải bồi hoặc lá chuối khô theo phương pháp xưa.',
    historicalContext: 'Thể hiện phong thái đàng hoàng, chính trực, kín đáo và tôn nghiêm của người mặc. Không chỉ giữ ấm cổ mà còn nhắc nhở người mặc luôn giữ tư thế ngẩng cao đầu, lưng thẳng.',
    fabricOrigin: 'Lụa Vạn Phúc (Hà Đông) bồi đũi Nam Cao',
    location: 'Huế & Thăng Long cổ',
    culturalLesson: 'Tôn trọng bản thân và người đối diện qua phong thái kín đáo, đoan trang.'
  },
  ngu_thuong_cuc: {
    id: 'ngu_thuong_cuc',
    title: 'Năm Hạt Cúc Ngũ Thường',
    subtitle: 'Nhân · Lễ · Nghĩa · Trí · Tín',
    meaning: '5 hạt cúc trên áo ngũ thân được cài cẩn trọng bên ngực phải: Cúc 1 (Nhân) ở cổ, Cúc 2 (Lễ) ở xương đòn, Cúc 3 (Nghĩa) dưới nách, Cúc 4 (Trí) ở mạn sườn, Cúc 5 (Tín) ở ngang hông.',
    historicalContext: 'Mỗi lần cài cúc áo trước khi ra đường, người xưa như tự nhắc nhở mình về 5 phẩm hạnh nền tảng làm người: Yêu thương đồng loại (Nhân), cung kính khiêm nhường (Lễ), sống chính trực công bằng (Nghĩa), mở mang trí tuệ (Trí) và giữ vững uy tín (Tín).',
    fabricOrigin: 'Cúc cài bọc lụa đồng màu hoặc khuy đồng, cúc ngọc chạm hoa cúc',
    location: 'Toàn xứ Đàng Trong & Đàng Ngoài',
    culturalLesson: 'Trang phục không chỉ để mặc đẹp mà là bài học luân lý sống động mỗi ngày.'
  },
  tu_than_phu_mau: {
    id: 'tu_than_phu_mau',
    title: 'Cấu Trúc Năm Thân Áo (Ngũ Thân)',
    subtitle: 'Đạo hiếu "Tứ Thân Phụ Mẫu" & Thân con nội trợ',
    meaning: 'Áo gồm 5 thân vải: 2 thân trước, 2 thân sau ghép lại tượng trưng cho Tứ thân phụ mẫu (cha mẹ đẻ và cha mẹ chồng); thân thứ 5 (thân con) nhỏ hơn nằm lót bên trong ngực tượng trưng cho người mặc.',
    historicalContext: 'Chiếc áo ôm trọn người mặc như hình ảnh người con luôn được chở che, bảo bọc trong tình yêu thương của cha mẹ hai bên. Người mặc áo ngũ thân luôn ý thức sống sao cho xứng đáng với công ơn sinh thành dưỡng dục.',
    fabricOrigin: 'Lụa tơ tằm dệt thủ công khổ 40cm truyền thống',
    location: 'Châu thổ Sông Hồng & Kinh đô Phú Xuân',
    culturalLesson: 'Gốc rễ gia đình và đạo hiếu là nền tảng vững chắc của người trẻ hôm nay.'
  },
  nhat_binh_collar: {
    id: 'nhat_binh_collar',
    title: 'Cổ Chữ Nhật Áo Nhật Bình',
    subtitle: 'Thường phục vương giả triều Nguyễn',
    meaning: 'Viền cổ áo to bản tạo thành hình chữ nhật trước ngực, nẹp thêu hoa văn ngũ hành, loan phượng, hoa cúc và quả lựu.',
    historicalContext: 'Dành riêng cho Hoàng thái hậu, Hoàng hậu, Công chúa và mệnh phụ quý tộc. Từng đường thêu nẹp cổ đều mang quy chuẩn phẩm trật nghiêm ngặt.',
    fabricOrigin: 'Lãnh Mỹ A đen huyền thoại (An Giang) & Gấm thêu sa hạt tiến cung',
    location: 'Đại Nội Huế',
    culturalLesson: 'Vẻ đẹp uy nghi, quyền quý và đỉnh cao của mỹ nghệ thêu tay cung đình Việt Nam.'
  },
  ngu_sac_cuffs: {
    id: 'ngu_sac_cuffs',
    title: 'Dải Ngũ Sắc Nơi Cổ Tay Áo Nhật Bình',
    subtitle: 'Biểu trưng Kim · Mộc · Thủy · Hỏa · Thổ',
    meaning: '5 dải vải màu sắc ghép lại ở cửa tay áo: Trắng (Kim), Xanh (Mộc), Lam (Thủy), Đỏ (Hỏa), Vàng (Thổ).',
    historicalContext: 'Thể hiện quy luật vận hành của vũ trụ ngũ hành tương sinh, mang lại sự bình an, hòa thuận và thịnh vượng cho quốc thái dân an.',
    fabricOrigin: 'Tơ lụa nhuộm màu thảo mộc tự nhiên',
    location: 'Kinh thành Huế',
    culturalLesson: 'Tư duy triết học phương Đông hòa quyện vào ngôn ngữ màu sắc thời trang.'
  },
  that_lung_dieu: {
    id: 'that_lung_dieu',
    title: 'Thắt Lưng Lụa Màu Điều',
    subtitle: 'Văn hóa Kinh Bắc & Lễ hội Hội Lim',
    meaning: 'Dải lụa mềm mại màu hồng điều thắt nhẹ ngang eo áo tứ thân, buông lơi hai dải tơ bay phấp phới trong gió xuân.',
    historicalContext: 'Tạo điểm nhấn duyên dáng cho liền chị quan họ Kinh Bắc, tôn lên vòng eo thon thả mà vẫn kín đáo, e ấp.',
    fabricOrigin: 'Lụa làng Chào, lụa Vạn Phúc mộc mạc',
    location: 'Bắc Ninh, Bắc Giang',
    culturalLesson: 'Nét duyên mộc mạc, ý nhị của người phụ nữ nông thôn Bắc Bộ xưa.'
  },
  lemur_collar: {
    id: 'lemur_collar',
    title: 'Cổ Cánh Sen Áo Dài Lemur 1930s',
    subtitle: 'Cách mạng thời trang của họa sĩ Cát Tường',
    meaning: 'Cổ áo bẻ cánh sen hoặc lá sen tròn viền đăng-ten đăng đối kiểu Pháp, mở đầu cho sự hội nhập thẩm mỹ phương Tây.',
    historicalContext: 'Năm 1934, tờ báo Phong Hóa giới thiệu áo dài Lemur, giải phóng đường cong cơ thể phụ nữ Việt Nam và trở thành biểu tượng của vẻ đẹp tân thời.',
    fabricOrigin: 'Lụa tơ tằm dệt vân mỏng Hà Đông',
    location: 'Hà Nội thập niên 1930',
    culturalLesson: 'Tinh thần dũng cảm đổi mới sáng tạo, dám đón nhận cái mới để nâng tầm cái cũ.'
  },
  tho_cam: {
    id: 'tho_cam',
    title: 'Thổ Cẩm Dệt Tay Bản Địa Tây Bắc',
    subtitle: 'Di sản dệt sợi lanh người H\'Mông & Thái',
    meaning: 'Họa tiết hình học quả trám, mắt công, mặt trời dệt từ sợi lanh tự nhiên, nhuộm chàm sâu thẳm và thêu hoa văn chỉ màu rực rỡ.',
    historicalContext: 'Mỗi tấm vải thổ cẩm là cuốn nhật ký bằng hình ảnh kể về núi rừng, mùa màng và tâm hồn khoáng đạt của đồng bào các dân tộc thiểu số vùng cao.',
    fabricOrigin: 'Vải lanh tự nhiên dệt khung cửi thủ công',
    location: 'Hà Giang, Sapa, Sơn La',
    culturalLesson: 'Sự phong phú đa dạng của bản sắc văn hóa các dân tộc anh em trên dải đất hình chữ S.'
  },
  khan_van: {
    id: 'khan_van',
    title: 'Khăn Vấn Nhung Đen Truyền Thống',
    subtitle: 'Vẻ đẹp tôn vinh khuôn trăng người Việt',
    meaning: 'Khăn vấn nhiều nếp quấn gọn quanh mái tóc, tạo thành hình vành cung thanh thoát ôm trọn khuôn mặt.',
    historicalContext: 'Giúp tôn lên vầng trán cao thông minh và nét đoan trang của cả nam giới lẫn nữ giới thời Nguyễn.',
    fabricOrigin: 'Nhung the Nam Định hoặc lụa đũi',
    location: 'Hà Nội & các tỉnh Bắc Bộ, Trung Bộ',
    culturalLesson: 'Sự gọn gàng, mực thước và thanh lịch trong nếp sống hàng ngày.'
  },
  quat_giay: {
    id: 'quat_giay',
    title: 'Quạt Giấy Làng Nghề Chàng Sơn',
    subtitle: 'Nét phong lưu tao nhã xứ Đoài',
    meaning: 'Quạt nan tre dẻo dai bồi giấy điệp, châm kim hoa văn hoặc vẽ tranh phong cảnh quê hương.',
    historicalContext: 'Làng Chàng Sơn (Thạch Thất, Hà Nội) có nghề làm quạt hàng trăm năm, từng theo chân sứ thần Việt Nam sang triều đình ngoại bang làm quà tặng tao nhã.',
    fabricOrigin: 'Tre rừng xứ Đoài & Giấy dó, giấy điệp Đông Triều',
    location: 'Làng Chàng Sơn, Hà Nội',
    culturalLesson: 'Sự tinh tế từ những vật dụng mộc mạc nhất trong đời sống.'
  }
};

interface HeritageModalProps {
  hotspotKey: string | null;
  onClose: () => void;
}

export default function HeritageFlashcardModal({ hotspotKey, onClose }: HeritageModalProps) {
  if (!hotspotKey) return null;

  const data = FLASHCARDS_REGISTRY[hotspotKey] || {
    id: hotspotKey,
    title: 'Chi Tiết Trang Phục Cổ Phong',
    subtitle: 'Di sản phục sức ngàn năm',
    meaning: 'Mỗi chi tiết trên y phục Việt xưa đều mang một tầng ý nghĩa sâu xa về nhân sinh quan và đạo làm người.',
    historicalContext: 'Trải qua nhiều thế kỷ đúc kết, trang phục dân tộc là sự kết tinh của tư duy thẩm mỹ và đạo đức gia đình Á Đông.',
    culturalLesson: 'Khám phá và trân trọng giá trị nguồn cội cùng thế hệ trẻ.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-amber-900/20 shadow-2xl overflow-hidden text-stone-900">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-stone-200/80 bg-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-900/10 text-amber-900 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold">
                Thẻ Tri Thức Văn Hóa
              </span>
              <h3 className="text-lg font-serif-title font-bold text-stone-900 mt-0.5">
                {data.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Đóng thẻ tri thức"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Subtitle kicker */}
          <div className="text-xs font-medium text-amber-900/80 bg-amber-100/60 px-3 py-1.5 rounded-lg inline-block">
            {data.subtitle}
          </div>

          {/* Meaning Section */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Ý Nghĩa Cốt Lõi</span>
            <p className="text-sm text-stone-800 leading-relaxed font-serif">
              &ldquo;{data.meaning}&rdquo;
            </p>
          </div>

          {/* Historical Context Section */}
          <div className="space-y-1 pt-2 border-t border-stone-200/70">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Bối Cảnh Lịch Sử</span>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {data.historicalContext}
            </p>
          </div>

          {/* Provenance and location tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {data.fabricOrigin && (
              <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-400 block mb-0.5">Chất Liệu & Làng Nghề:</span>
                <span className="font-medium text-stone-900">{data.fabricOrigin}</span>
              </div>
            )}
            {data.location && (
              <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-400 block mb-0.5">Địa Danh Xuất Xứ:</span>
                <span className="font-medium text-stone-900">{data.location}</span>
              </div>
            )}
          </div>

          {/* Cultural Lesson Note */}
          <div className="p-3.5 bg-amber-900/5 rounded-2xl border border-amber-900/10 text-xs text-amber-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Thông Điệp Cho Người Trẻ:</span>
              <p className="mt-0.5 text-stone-700">{data.culturalLesson}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200/80 bg-white/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors"
          >
            Đã Hiểu & Tiếp Tục Phối Đồ
          </button>
        </div>
      </div>
    </div>
  );
}
