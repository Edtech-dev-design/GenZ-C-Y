export interface GarmentItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'main' | 'inner' | 'bottom' | 'shoes' | 'accessory';
  subType?: string;
  era: string; // e.g. "Thời Nguyễn (1802–1945)", "Bắc Bộ truyền thống", "Thập niên 1930"
  description: string;
  story: string;
  fusionTip: string;
  defaultColor: string;
  accentColor?: string;
  tags: string[];
  historicalDetails?: {
    collar?: string;
    buttons?: string;
    meaning?: string;
    fabricOrigin?: string;
  };
}

export interface ColorSwatch {
  id: string;
  name: string;
  vietnameseName: string;
  hex: string;
  element: 'Hỏa' | 'Thổ' | 'Mộc' | 'Thủy' | 'Kim' | 'GenZ';
  meaning: string;
}

export interface PBRMaterialShader {
  id: string;
  name: string;
  vietnameseName: string;
  type: string;
  roughness: number;
  metallic: number;
  subsurface: number;
  previewColor: string;
  description: string;
}

export const PBR_MATERIALS: PBRMaterialShader[] = [
  {
    id: 'raw_slub_silk',
    name: 'Raw Slub Silk',
    vietnameseName: 'Đũi Tơ Tằm Thô Mộc',
    type: 'Textile (Sợi tự nhiên)',
    roughness: 0.78,
    metallic: 0.05,
    subsurface: 0.42,
    previewColor: '#FAF8F5',
    description: 'Bề mặt đũi tơ tằm thô dệt tay với các gợn sợi không hoàn hảo hữu cơ (organic slub weave), độ bóng mờ sang trọng, bắt sáng tự nhiên.'
  },
  {
    id: 'brushed_antique_bronze',
    name: 'Brushed Antique Bronze',
    vietnameseName: 'Đồng Thau Cổ Khắc Khảm',
    type: 'Metal (Kim loại chạm khắc)',
    roughness: 0.35,
    metallic: 0.92,
    subsurface: 0.0,
    previewColor: '#CA8A04',
    description: 'Chất liệu đồng thau đúc thủ công cho 5 hạt cúc Ngũ Thường, bề mặt xước phay filigree ánh vàng đồng ấm áp theo năm tháng.'
  },
  {
    id: 'vulcanized_gum_rubber',
    name: 'Vulcanized Gum Rubber',
    vietnameseName: 'Cao Su Lưu Hóa Vintage',
    type: 'Elastomer (Đế giày retro)',
    roughness: 0.62,
    metallic: 0.02,
    subsurface: 0.28,
    previewColor: '#D97706',
    description: 'Đế cao su lưu hóa màu hổ phách mật ong của đôi sneaker cổ điển, tăng độ bám và tạo điểm nhấn tương phản đất nung terracotta.'
  },
  {
    id: 'glazed_pottery',
    name: 'Smooth Glazed Pottery',
    vietnameseName: 'Gốm Men Tro Cổ Bát Tràng',
    type: 'Ceramic (Gốm thủ công)',
    roughness: 0.15,
    metallic: 0.08,
    subsurface: 0.18,
    previewColor: '#38BDF8',
    description: 'Lớp men tro tráng bóng mượt mà, phản xạ ánh sáng studio 3 điểm sắc nét, biểu trưng cho nghệ thuật chế tác men gốm di sản.'
  }
];

export interface StylingPreset {
  id: string;
  title: string;
  tagline: string;
  persona: string;
  event: string;
  weather: string;
  mainGarmentId: string;
  innerGarmentId: string;
  bottomGarmentId: string;
  shoesId: string;
  accessoryId: string;
  mainColor: string;
  innerColor: string;
  bottomColor: string;
  isOpenOuterwear: boolean;
  lapelDirection: 'right' | 'left';
  harmonyScore: number;
}

// 1. Core Heritage Garment Catalog
export const MAIN_GARMENTS: GarmentItem[] = [
  {
    id: 'ngu_than_tay_chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    subtitle: 'Thời Nguyễn · Dáng gọn thường phục',
    category: 'main',
    subType: 'ngu_than',
    era: 'Thời Nguyễn (Thế kỷ 19 - đầu 20)',
    description: 'Cổ đứng (lập lĩnh), cài khuy bên phải (hữu nhậm), 5 thân áo mang ý nghĩa "Tứ thân phụ mẫu" và chính bản thân người mặc, thể hiện đạo làm người.',
    story: 'Ra đời dưới cải cách y phục của Chúa Nguyễn Phúc Khoát và Vua Minh Mạng, áo ngũ thân tay chẽn là chuẩn mực trang phục tao nhã của người Việt, thuận tiện cho sinh hoạt thường nhật.',
    fusionTip: 'Dáng tay chẽn cực kỳ gọn gàng, hoàn hảo khi mix cùng quần jeans thụng cạp trễ, quần âu xếp ly và giày retro sneakers.',
    defaultColor: '#1E3A8A', // Lam chàm thẫm
    tags: ['Thời Nguyễn', 'Tay Chẽn', 'Hữu Nhậm', 'Casual Fusion'],
    historicalDetails: {
      collar: 'Lập lĩnh (cổ đứng tròn ôm khít cổ, thể hiện sự kín đáo, chính trực)',
      buttons: '5 hạt cúc (Ngũ thường: Nhân - Lễ - Nghĩa - Trí - Tín)',
      meaning: '5 thân áo: 2 thân trước, 2 thân sau tượng trưng cho Tứ thân phụ mẫu; 1 thân con bên trong tượng trưng cho người mặc',
      fabricOrigin: 'Lụa Vạn Phúc (Hà Đông) & Đũi Nam Cao (Thái Bình)'
    }
  },
  {
    id: 'ngu_than_tay_thung',
    name: 'Áo Ngũ Thân Tay Thụng (Áo Tía)',
    subtitle: 'Thời Nguyễn · Lễ phục trang trọng',
    category: 'main',
    subType: 'ngu_than',
    era: 'Thời Nguyễn (Thế kỷ 19 - đầu 20)',
    description: 'Ống tay thụng rộng rãi buông rủ uyển chuyển, vạt áo dài qua gối, tôn lên khí chất tôn nghiêm và phong thái nho nhã.',
    story: 'Trang phục dành cho các dịp lễ tiết, khoa cử và hội hè cung đình hoặc tế lễ làng xã. Người mặc tay áo thụng thường chắp tay (vái chào) tạo nên nét cung kính thanh tao.',
    fusionTip: 'Phối mở tà như một chiếc kimono coat / duster cardigan hiện đại, buông rủ trên nền set đồ tối giản trắng đen.',
    defaultColor: '#B91C1C', // Đỏ chu sa
    tags: ['Lễ Phục', 'Tay Thụng', 'Uy Nghi', 'Avant-Garde'],
    historicalDetails: {
      collar: 'Lập lĩnh cao viền chỉ tơ vàng óng',
      buttons: 'Khuy ngọc hoặc cúc đồng chạm nổi hoa cúc',
      meaning: 'Sự bao bọc, khoan dung và cốt cách ung dung tự tại của người quân tử',
      fabricOrigin: 'Gấm lụa tơ tằm dệt hoa Thủy Ba xứ Huế'
    }
  },
  {
    id: 'nhat_binh',
    name: 'Áo Nhật Bình',
    subtitle: 'Hoàng tộc triều Nguyễn · Nẹp chữ nhật ngũ hành',
    category: 'main',
    subType: 'nhat_binh',
    era: 'Cung đình Triều Nguyễn (1802–1945)',
    description: 'Áo dạng đối khâm, cổ áo to bản hình chữ nhật viền hoa văn tinh xảo, dải ngũ sắc ngũ hành ở cổ tay, nẹp áo thêu loan phượng và hoa cúc.',
    story: 'Thường phục của bậc Hoàng hậu, Phi tần và Công chúa; quý phụ mệnh phụ triều đình. Tên gọi Nhật Bình xuất phát từ viền cổ ghép lại tạo thành hình chữ nhật trước ngực.',
    fusionTip: 'Sử dụng như một chiếc áo khoác outerwear / cardigan dáng dài sang trọng khoác hờ bên ngoài trang phục monochrome Gen Z.',
    defaultColor: '#C2410C', // Đỏ cam hoàng tộc / Sa hoàng
    tags: ['Hoàng Tộc', 'Đối Khâm', 'Ngũ Sắc', 'Statement Piece'],
    historicalDetails: {
      collar: 'Đối khâm chữ nhật (tượng trưng cho đất trời vuông tròn hòa hợp)',
      buttons: 'Dải ngũ hành và khuy cài ngọc bích trước ngực',
      meaning: 'Sự quyền quý, đức hạnh của bậc mẫu nghi thiên hạ',
      fabricOrigin: 'Lãnh Mỹ A (Tân Châu, An Giang) & Gấm thêu chỉ vàng tiến vua'
    }
  },
  {
    id: 'tu_than',
    name: 'Áo Tứ Thân & Thắt Lưng Điều',
    subtitle: 'Văn hóa Kinh Bắc · Vạt áo buông lơi duyên dáng',
    category: 'main',
    subType: 'tu_than',
    era: 'Văn hóa Bắc Bộ & Đồng bằng sông Hồng',
    description: '4 vạt áo gồm 2 vạt sau may liền sống áo và 2 vạt trước buông lơi hoặc buộc trước bụng, kết hợp thắt lưng lụa màu điều mềm mại.',
    story: 'Gắn liền với hình ảnh liền chị quan họ Kinh Bắc, câu ca dao mộc mạc và hội Lim mùa xuân. Thể hiện sự đảm đang, tháo vát và tình tứ của người phụ nữ đất Bắc.',
    fusionTip: 'Thả 2 vạt trước buông lơi phối cùng chân váy xếp ly tennis hoặc quần ống suông, biến tấu thắt lưng điều thành phụ kiện obi belt.',
    defaultColor: '#15803D', // Xanh lục bích mộc mạc
    tags: ['Kinh Bắc', 'Tứ Thân', 'Lãng Mạn', 'Folk Fusion'],
    historicalDetails: {
      collar: 'Cổ mở khoe khéo yếm đào bên trong',
      buttons: 'Không dùng cúc, dùng dải yếm và thắt lưng lụa buộc vạt',
      meaning: '4 vạt tượng trưng cho tứ thân phụ mẫu (cha mẹ đẻ và cha mẹ chồng)',
      fabricOrigin: 'Đũi tơ tằm nhuộm củ nâu, lá chàm tự nhiên'
    }
  },
  {
    id: 'lemur_tan_thoi',
    name: 'Áo Tân Thời Lemur',
    subtitle: 'Thập niên 1930 · Cuộc cách mạng Đông - Tây',
    category: 'main',
    subType: 'lemur',
    era: 'Phong trào Thơ Mới (Họa sĩ Cát Tường 1934)',
    description: 'Sự mở đầu của thời trang giao lưu văn hóa Đông - Tây với cổ cánh sen, tay phồng viền đăng-ten, chiết eo tôn vinh đường cong người phụ nữ.',
    story: 'Được thiết kế bởi họa sĩ Lemur Nguyễn Cát Tường năm 1934, tạo nên làn sóng cách tân trang phục rực rỡ trong giới trí thức trẻ và nữ sinh Hà thành thời bấy giờ.',
    fusionTip: 'Phối cùng kính mát oval Y2K, túi kẹp nách baguette và giày mary jane da bóng cho outfit dạo phố vintage cực chất.',
    defaultColor: '#831843', // Mận chín / Hồng phấn retro
    tags: ['Thập Niên 30', 'Tân Thời', 'Tay Phồng', 'Retro Chic'],
    historicalDetails: {
      collar: 'Cổ cánh sen hoặc cổ lá bẻ viền đăng-ten kiểu Pháp',
      buttons: 'Khuy bấm bên sườn hoặc nơ thắt điệu đà',
      meaning: 'Tinh thần giải phóng phụ nữ, đề cao vẻ đẹp tự do hiện đại',
      fabricOrigin: 'Lụa tơ tằm Vạn Phúc dệt vân mỏng mềm mại'
    }
  },
  {
    id: 'ao_giao_linh',
    name: 'Áo Giao Lĩnh (Cổ Chéo)',
    subtitle: 'Thời Lý - Trần - Lê · Cổ phục thượng cổ',
    category: 'main',
    subType: 'giao_linh',
    era: 'Triều Lý - Trần - Hậu Lê (Thế kỷ 11 - 18)',
    description: 'Áo cổ chéo vạt đè sang phải, thân áo rộng rãi buông rủ bề thế, thắt đai lưng lụa, là tiền thân của dòng chảy trang phục truyền thống Việt Nam.',
    story: 'Trang phục phổ biến của cả nam và nữ từ bậc đế vương, hoàng hậu đến quan lại và thường dân suốt một nghìn năm lịch sử trước cải cách thời Nguyễn.',
    fusionTip: 'Mặc khoác hờ như dạng áo kimono jacket / robe phong cách avant-garde hiện đại, tạo nên lớp layer đậm chất Á Đông huyền bí.',
    defaultColor: '#1E3A8A', // Lam chàm cổ điển
    tags: ['Lý - Trần - Lê', 'Giao Lĩnh', 'Cổ Đại', 'Tiền Thân Áo Dài'],
    historicalDetails: {
      collar: 'Giao lĩnh (hai vạt cổ giao nhau hình chữ Y trước ngực)',
      buttons: 'Buộc bằng dải lụa thắt đai lưng (Đới bản)',
      meaning: 'Âm dương hòa hợp, trời đất giao thoa, phong thái ung dung tự tại',
      fabricOrigin: 'Gấm lụa dệt hoa thời Trần & lụa tơ tằm cổ truyền'
    }
  },
  {
    id: 'ao_dai_ba_nhu',
    name: 'Áo Dài Cổ Thuyền (1958)',
    subtitle: 'Giữa thế kỷ 20 · Phá cách hiện đại',
    category: 'main',
    subType: 'co_thuyen',
    era: 'Thập niên 1950 - 1960',
    description: 'Thiết kế cổ thuyền khoét rộng thanh thoát khoe trọn xương quai xanh quyến rũ, eo chiết thon thả, tay lỡ năng động và phóng khoáng.',
    story: 'Xuất hiện năm 1958, gây sốt và tạo nên trào lưu thời trang rực rỡ suốt thập niên 60 tại Sài Gòn và khắp miền Nam, là bước chuyển ngoạn mục sang áo dài hiện đại.',
    fusionTip: 'Cực kỳ tôn dáng khi phối cùng vòng cổ ngọc trai choker, kính râm mắt mèo cat-eye và giày cao gót mũi nhọn.',
    defaultColor: '#EAB308', // Vàng hoàng yến tươi sáng
    tags: ['Năm 1958', 'Cổ Thuyền', 'Thanh Lịch', 'Phóng Khoáng'],
    historicalDetails: {
      collar: 'Cổ thuyền khoét rộng (không có chân cổ đứng)',
      buttons: 'Khuy bấm bên sườn hoặc khóa kéo sau lưng',
      meaning: 'Nét đẹp kiêu sa, giải phóng cổ áo kín cổng cao tường truyền thống',
      fabricOrigin: 'Lụa phi bóng & Gấm hoa cao cấp'
    }
  }
];

// 2. Inner Layer Options
export const INNER_LAYERS: GarmentItem[] = [
  {
    id: 'yem_dao_sen',
    name: 'Yếm Đào Hoa Sen',
    subtitle: 'Nội y truyền thống Kinh Bắc',
    category: 'inner',
    era: 'Truyền thống Bắc Bộ',
    description: 'Áo yếm lụa cắt chéo ngực hình cánh sen, dây lưng buông lơi sau gáy, tôn lên nét duyên ngầm thuần khiết.',
    story: 'Trang phục lót thiêng liêng và quyến rũ nhất của phụ nữ Việt xưa, thường mặc bên trong áo tứ thân hoặc ngũ thân mỏng.',
    fusionTip: 'Có thể mặc như một chiếc halter top hiện đại, phối ngoài một lớp áo sơ mi trắng mỏng hoặc khoác blazer.',
    defaultColor: '#FDA4AF', // Hồng phấn cánh sen
    tags: ['Yếm Đào', 'Halter', 'Lụa Mịn']
  },
  {
    id: 'yem_co_xay_trang',
    name: 'Yếm Cổ Xây Trắng Ngà',
    subtitle: 'Yếm cổ tròn kín đáo thanh lịch',
    category: 'inner',
    era: 'Truyền thống',
    description: 'Dáng yếm khoét cổ tròn ôm sát chân cổ, may bằng lụa đũi trắng ngà mềm mại, kín đáo và trang nhã.',
    story: 'Thường mặc bên trong áo ngũ thân để giữ ấm và tạo nên lớp viền cổ trắng tinh tế hé lộ sau lớp áo ngoài.',
    fusionTip: 'Tạo hiệu ứng layer "trong lộ ngoài ẩn" chuẩn mực phong cách cổ phục.',
    defaultColor: '#FAF8F5',
    tags: ['Cổ Xây', 'Thanh Nhã', 'Minimalist']
  },
  {
    id: 'graphic_tee_y2k',
    name: 'Áo Thun Graphic Phố Cổ Y2K',
    subtitle: 'Streetwear đương đại thế hệ Z',
    category: 'inner',
    era: 'Gen Z Đương đại',
    description: 'Áo thun cotton dáng baby tee hoặc oversized in typo chữ Nôm cách điệu và đồ họa Tháp Rùa hiện đại.',
    story: 'Biểu tượng của thế hệ trẻ mang tinh thần đường phố Hà Nội và Sài Gòn vào thời trang heritage.',
    fusionTip: 'Mặc lót bên trong áo ngũ thân mở tà hoặc áo Nhật bình dáng outerwear tạo độ tương phản cực nghệ.',
    defaultColor: '#18181B', // Đen than washed
    tags: ['Streetwear', 'Graphic Tee', 'Y2K']
  },
  {
    id: 'minimal_mockneck',
    name: 'Áo Thun Cổ Lọ Tối Giản',
    subtitle: 'Lớp lót phong cách monochrome',
    category: 'inner',
    era: 'Hiện đại',
    description: 'Áo thun dệt kim ôm vừa vặn cổ cao 3cm, chất liệu cotton modal thoáng khí.',
    story: 'Giúp tôn trọn dáng cổ áo ngũ thân lập lĩnh hoặc cổ vuông Nhật bình mà không gây bí bách.',
    fusionTip: 'Rất hợp cho thời tiết se lạnh mùa thu đông tại Hà Nội hay Đà Lạt.',
    defaultColor: '#FAF8F5',
    tags: ['Monochrome', 'Thu Đông', 'Clean Look']
  }
];

// 3. Bottom Layer Options
export const BOTTOM_LAYERS: GarmentItem[] = [
  {
    id: 'quan_midnight_indigo_canvas',
    name: 'Quần Trousers Midnight-Indigo Xếp Ly Kiến Trúc',
    subtitle: 'Vải Linen-Cotton Canvas dầy dặn · Architectural Pleats',
    category: 'bottom',
    era: 'Gen Z Contemporary Haute Tailoring',
    description: 'Quần cạp cao ống suông rộng (high-waisted wide-leg) dệt từ vải linen-cotton canvas màu lam chàm thẫm midnight-indigo, đường xếp ly kiến trúc sắc lẹm buông phủ hoàn hảo qua đôi retro sneaker.',
    story: 'Thiết kế chuẩn mực giao thoa giữa cấu trúc may đo kiến trúc hiện đại và chất liệu vải sợi dệt mộc Việt Nam, tạo nên tỷ lệ cơ thể thanh thoát, bề thế.',
    fusionTip: 'Phối cùng áo ngũ thân đũi tơ ngà mở vạt hông, khoe trọn nếp xếp ly kiến trúc phía trước và quạt giấy Dó gài hông.',
    defaultColor: '#1E1B4B', // Midnight indigo
    tags: ['Architectural Pleat', 'Midnight Indigo', 'Linen Canvas', 'Metahuman']
  },
  {
    id: 'quan_lua_suong_trang',
    name: 'Quần Lụa Ống Suông Trắng Ngà',
    subtitle: 'Trang phục chuẩn mực cổ điển',
    category: 'bottom',
    era: 'Thời Nguyễn & Dân gian',
    description: 'Quần lụa tơ tằm dệt trơn, ống rộng 30-35cm, cạp chun luồn dây lụa, buông rủ thướt tha khi sải bước.',
    story: 'Chiếc quần kinh điển đi cùng mọi dáng áo dài và ngũ thân từ thế kỷ 18 đến nay, tượng trưng cho vẻ thuần khiết.',
    fusionTip: 'Phối cùng sneaker trắng tối giản để giữ nguyên vẻ thanh thoát nhưng vẫn năng động.',
    defaultColor: '#FAF8F5',
    tags: ['Lụa Suông', 'Truyền Thống', 'Thướt Tha']
  },
  {
    id: 'quan_jeans_thung_y2k',
    name: 'Quần Jeans Ống Thụng Rách Gối Y2K',
    subtitle: 'Streetwear bụi bặm phá cách',
    category: 'bottom',
    era: 'Gen Z Streetwear',
    description: 'Quần denim xanh wash bạc màu, dáng ống thụng suông dài trùm giày, cạp trễ phóng khoáng.',
    story: 'Cú twist thời trang ngoạn mục khi chiếc áo ngũ thân 200 năm tuổi gặp gỡ văn hóa hip-hop và skater Gen Z.',
    fusionTip: 'Phối cùng áo ngũ thân tay chẽn hoặc áo Nhật bình mở tà, xắn gấu nhẹ khoe giày retro.',
    defaultColor: '#3B82F6', // Denim blue
    tags: ['Jeans Thụng', 'Y2K', 'Bụi Bặm', 'Phá Cách']
  },
  {
    id: 'chan_vay_xep_ly_midi',
    name: 'Chân Váy Xếp Ly Dáng Dài',
    subtitle: 'Nữ tính thanh lịch giao thoa',
    category: 'bottom',
    era: 'Đương đại',
    description: 'Chân váy xếp ly nhỏ dập nhiệt ly sắc nét, chất liệu voan lụa xếp tầng bay bổng.',
    story: 'Gợi nhớ đến tà váy đụp mềm mại của vùng châu thổ sông Hồng nhưng với kỹ thuật cắt may hiện đại.',
    fusionTip: 'Rất hợp khi phối cùng áo tứ thân hoặc áo Lemur tân thời có chiết eo.',
    defaultColor: '#1C1917', // Đen tuyền
    tags: ['Xếp Ly', 'Midi Skirt', 'Bay Bổng']
  },
  {
    id: 'quan_au_pleated_retro',
    name: 'Quần Âu Xếp Ly Ống Suông Retro',
    subtitle: 'Phong cách Smart Casual tinh tế',
    category: 'bottom',
    era: 'Thập niên 70 - Hiện đại',
    description: 'Quần tây chất dạ len mỏng, cạp cao hai ly trước, dáng suông đứng thẳng tắp tôn dáng.',
    story: 'Sự pha trộn giữa vẻ trí thức cổ điển của sinh viên Hà Nội xưa và phong cách tối giản thanh lịch.',
    fusionTip: 'Cực kỳ ăn ý với áo ngũ thân tay chẽn đi cà phê triển lãm hay dự lễ bế giảng.',
    defaultColor: '#78716C', // Nâu xám khói
    tags: ['Quần Âu', 'Smart Casual', 'Tôn Dáng']
  }
];

// 4. Shoes Options
export const SHOES_ITEMS: GarmentItem[] = [
  {
    id: 'hai_theu_hoa_sen',
    name: 'Hài Thêu Hoa Sen Cổ Phong',
    subtitle: 'Hài gấm mũi cong truyền thống',
    category: 'shoes',
    era: 'Cung đình & Quý tộc xưa',
    description: 'Hài nhung dạ đỏ hoặc xanh chàm, mũi hơi vểnh nhẹ, thêu họa tiết búp sen và chỉ kim tuyến óng ánh.',
    story: 'Từng bước đi nhẹ tênh, tôn lên dáng đi đài các và đoan trang của người mặc cổ phục.',
    fusionTip: 'Lựa chọn số 1 cho các bộ ảnh kỷ yếu nghiêm cẩn hoặc lễ hội văn hóa truyền thống.',
    defaultColor: '#B91C1C',
    tags: ['Hài Thêu', 'Thuần Cổ', 'Hoa Sen']
  },
  {
    id: 'retro_chunky_sneakers',
    name: 'Sneakers Retro Chunky Trắng',
    subtitle: 'Biểu tượng đường phố Gen Z',
    category: 'shoes',
    era: 'Thập niên 90 - Nay',
    description: 'Đôi giày thể thao đế bánh mì dày dặn, phối mảng da lộn xám và trắng ngà thời thượng.',
    story: 'Cứu tinh cho những ngày đi bộ cả ngàn bước dạo phố cổ, chụp ảnh kỷ yếu mà không lo mỏi chân.',
    fusionTip: 'Phối cùng quần lụa suông hoặc jeans thụng tạo nên tỷ lệ tương phản "cổ - kim" siêu hút mắt.',
    defaultColor: '#FAF8F5',
    tags: ['Chunky Sneaker', 'Năng Động', 'Gen Z']
  },
  {
    id: 'loafer_da_bong_chunky',
    name: 'Loafers Da Bóng Quai Ngang',
    subtitle: 'Nét cổ điển Preppy thời thượng',
    category: 'shoes',
    era: 'Hiện đại',
    description: 'Giày lười da bò bóng loáng, đế răng cưa đầm chân, quai đính khóa kim loại mạ đồng cổ.',
    story: 'Mang phong vị của những quý cô cậu ấm trường dòng đầu thế kỷ 20.',
    fusionTip: 'Phối cùng tất trắng lửng và áo Lemur tân thời hoặc ngũ thân tay chẽn.',
    defaultColor: '#18181B',
    tags: ['Loafers', 'Preppy', 'Cổ Điển']
  },
  {
    id: 'boots_da_co_thap',
    name: 'Ankle Boots Da Khóa Kéo',
    subtitle: 'Vẻ đẹp sắc sảo cá tính',
    category: 'shoes',
    era: 'Đương đại',
    description: 'Bốt cổ ngắn qua mắt cá, mũi nhọn thanh mảnh, đế vuông 5cm tôn dáng.',
    story: 'Đem lại sự mạnh mẽ, thời thượng cho những bản phối phá cách.',
    fusionTip: 'Cực ngầu khi mặc cùng áo Nhật bình xẻ tà khoác ngoài.',
    defaultColor: '#292524',
    tags: ['Boots', 'Cá Tính', 'Sắc Sảo']
  }
];

// 5. Accessories Options
export const ACCESSORIES_ITEMS: GarmentItem[] = [
  {
    id: 'khan_van_nhung',
    name: 'Khăn Vấn Nhung Đen / Xanh Chàm',
    subtitle: 'Nét duyên tóc cổ truyền Việt Nam',
    category: 'accessory',
    era: 'Thế kỷ 19 - 20',
    description: 'Khăn vấn nhiều nếp ôm trọn mái tóc, chất liệu nhung the hoặc lụa đũi tạo vẻ khuôn trăng đầy đặn.',
    story: 'Biểu tượng của nét đẹp thuần Việt, giúp định hình khuôn mặt thanh tú và vầng trán cao thông minh.',
    fusionTip: 'Đội khăn vấn kết hợp đeo khuyên tai bạc bản to hoặc kính râm oval.',
    defaultColor: '#18181B',
    tags: ['Khăn Vấn', 'Nhung The', 'Thuần Việt']
  },
  {
    id: 'non_quai_thao',
    name: 'Nón Quai Thao / Nón Ba Tầm',
    subtitle: 'Hồn quê quan họ Bắc Bộ',
    category: 'accessory',
    era: 'Văn hóa Bắc Bộ',
    description: 'Nón lá rộng vành phẳng, đan bằng lá gồi công phu, quai thao bằng dải tơ nhiều màu buông dài.',
    story: 'Vừa che nắng che mưa, vừa là đạo cụ e ấp giấu nụ cười duyên trong những canh hát quan họ.',
    fusionTip: 'Dùng làm phụ kiện cầm tay hoặc đeo chéo sau lưng như một tác phẩm mỹ nghệ điêu khắc.',
    defaultColor: '#EAB308',
    tags: ['Nón Quai Thao', 'Quan Họ', 'Đạo Cụ']
  },
  {
    id: 'kinh_mat_oval_y2k',
    name: 'Kính Râm Gọng Oval Cyber Retro',
    subtitle: 'Điểm nhấn tương lai giữa dòng hoài cổ',
    category: 'accessory',
    era: 'Y2K Gen Z',
    description: 'Kính mắt gọng kim loại mảnh dáng bầu dục, tròng kính xám khói hoặc tráng gương nhẹ.',
    story: 'Phụ kiện "must-have" tạo nên chất điện ảnh retro và thần thái ngút ngàn cho Gen Z khi chụp lookbook.',
    fusionTip: 'Đeo hờ trên sống mũi hoặc cài lên tóc kết hợp cùng áo ngũ thân.',
    defaultColor: '#71717A',
    tags: ['Kính Oval', 'Y2K', 'Thần Thái']
  },
  {
    id: 'tui_tho_cam_hmong',
    name: 'Túi Thổ Cẩm Dệt Tay H\'Mông / Thái',
    subtitle: 'Di sản thổ cẩm bản địa Tây Bắc',
    category: 'accessory',
    era: 'Dân tộc thiểu số Việt Nam',
    description: 'Túi đeo chéo dệt hoa văn hình học quả trám từ sợi lanh nhuộm chàm, thêu chỉ màu rực rỡ.',
    story: 'Mỗi mét vải thổ cẩm là kết tinh của hàng tháng trời se lanh, dệt vải và thêu hoa văn của phụ nữ vùng cao.',
    fusionTip: 'Tạo điểm nhấn họa tiết độc bản phá vỡ sự đơn điệu của trang phục trơn màu.',
    defaultColor: '#0284C7',
    tags: ['Thổ Cẩm', 'Tây Bắc', 'Dệt Tay', 'Bản Địa']
  },
  {
    id: 'quat_chang_son',
    name: 'Quạt Giấy Chàng Sơn / Quạt Lụa Tranh Thủy Mặc',
    subtitle: 'Nét phong lưu xứ Đoài',
    category: 'accessory',
    era: 'Làng nghề Chàng Sơn (Hà Nội)',
    description: 'Quạt nan tre dẻo dai bồi giấy điệp hoặc lụa vẽ tranh hoa sen, phong cảnh quê hương.',
    story: 'Đạo cụ không thể thiếu của các thi nhân, tài tử và giai nhân ngày hè kinh kỳ.',
    fusionTip: 'Vừa làm mát tự nhiên vừa là phụ kiện sống ảo tạo dáng duyên dáng.',
    defaultColor: '#E2E8F0',
    tags: ['Quạt Giấy', 'Xứ Đoài', 'Tao Nhã']
  },
  {
    id: 'tui_crossbody_harness',
    name: 'Túi Da Mini Crossbody Harness & Quạt Dó Gài Hông',
    subtitle: 'Matte black leather harness mini bag · Quạt tre giấy Dó',
    category: 'accessory',
    era: 'Gen Z Metahuman Streetwear',
    description: 'Túi da mini đeo chéo chạc ngực bằng da đen mờ có khóa kim loại gunmetal xước phay, kết hợp quạt nan tre bồi giấy Dó truyền thống gài hông.',
    story: 'Điểm nhấn phụ kiện đương đại định hình phong thái thanh niên Gen Z thế kỷ 21 tự tin bước ra thế giới cùng di sản phục sức ngàn năm.',
    fusionTip: 'Đeo chéo qua vai áo ngũ thân tạo đường cắt hình học táo bạo, gài nhẹ quạt giấy Dó vào đai cạp quần.',
    defaultColor: '#18181B',
    tags: ['Crossbody Harness', 'Quạt Giấy Dó', 'Matte Black', 'Metahuman']
  }
];

// 6. Five-Element Palette Matrix (Bảng Phối Màu Ngũ Hành Tương Sinh)
export const FIVE_ELEMENT_PALETTES: ColorSwatch[] = [
  {
    id: 'hoa_chu_sa',
    name: 'Hỏa: Đỏ Chu Sa',
    vietnameseName: 'Chu Sa Hoàng Tộc',
    hex: '#B91C1C',
    element: 'Hỏa',
    meaning: 'Năng lượng bùng cháy, quyền uy, may mắn và thịnh vượng (Hỏa sinh Thổ).'
  },
  {
    id: 'tho_hoang_yen',
    name: 'Thổ: Vàng Mơ Hoàng Yến',
    vietnameseName: 'Hoàng Yến Hoàng Gia',
    hex: '#EAB308',
    element: 'Thổ',
    meaning: 'Sự bao dung, ấm no, đất lành chim đậu và cốt cách vương giả (Thổ sinh Kim).'
  },
  {
    id: 'moc_luc_bich',
    name: 'Mộc: Xanh Lục Bích',
    vietnameseName: 'Lục Bích Non Nước',
    hex: '#15803D',
    element: 'Mộc',
    meaning: 'Sức sống đâm chồi nảy lộc, thanh bình và hòa hợp với thiên nhiên (Mộc sinh Hỏa).'
  },
  {
    id: 'thuy_lam_cham',
    name: 'Thủy: Lam Chàm Thẫm',
    vietnameseName: 'Lam Chàm Đại Ngàn',
    hex: '#1E3A8A',
    element: 'Thủy',
    meaning: 'Trí tuệ sâu sắc, biển rộng trời cao và lòng trung kiên bền chặt (Thủy sinh Mộc).'
  },
  {
    id: 'kim_trang_do',
    name: 'Kim: Trắng Ngà Giấy Dó',
    vietnameseName: 'Bạch Ngọc Dó Xưa',
    hex: '#FAF8F5',
    element: 'Kim',
    meaning: 'Tâm hồn trong sáng, thuần khiết và thanh cao liêm chính (Kim sinh Thủy).'
  },
  // Gen Z Extended Neo-Heritage Tones
  {
    id: 'genz_matcha',
    name: 'Pastel: Matcha Trà Xanh',
    vietnameseName: 'Trà Sớm Thái Nguyên',
    hex: '#84A98C',
    element: 'GenZ',
    meaning: 'Tone xanh dịu mát, chữa lành tâm hồn, rất được lòng giới trẻ sống xanh.'
  },
  {
    id: 'genz_lavender',
    name: 'Pastel: Tím Khói Chiều Tà',
    vietnameseName: 'Tím Khói Cố Đô',
    hex: '#A78BFA',
    element: 'GenZ',
    meaning: 'Sự lãng mạn mộng mơ xứ Huế kết hợp thẩm mỹ Y2K thời thượng.'
  },
  {
    id: 'genz_cyber_silver',
    name: 'Pastel: Bạc Ánh Trăng',
    vietnameseName: 'Nguyệt Quang Trâm Bạc',
    hex: '#CBD5E1',
    element: 'GenZ',
    meaning: 'Hiện đại, sắc lạnh, mang hơi thở tương lai hòa quyện nét cổ xưa.'
  },
  {
    id: 'genz_terracotta',
    name: 'Earth: Nung Gạch Cổ Bát Tràng',
    vietnameseName: 'Gốm Nung Bát Tràng',
    hex: '#C2410C',
    element: 'GenZ',
    meaning: 'Màu gốm mộc mạc, ấm áp, đậm đà dấu ấn làng nghề truyền thống.'
  }
];

// 7. Styling Presets based on Personas & Events
export const STYLING_PRESETS: StylingPreset[] = [
  {
    id: 'preset_metahuman_ngu_than',
    title: 'Metahuman Signature · 3D Museum Showcase (20 tuổi)',
    tagline: 'Áo Ngũ Thân đũi ngà slub weave mở vạt hông + Trousers Midnight-Indigo xếp ly & Retro Sneakers',
    persona: 'Người Mẫu Nam 20 Tuổi · 3D Metahuman',
    event: 'Triển Lãm Thiết Kế Nhân Vật 3D Bảo Tàng (Turntable)',
    weather: 'Studio 3-Point Lighting 24°C',
    mainGarmentId: 'ngu_than_tay_chen',
    innerGarmentId: 'yem_co_xay_trang',
    bottomGarmentId: 'quan_midnight_indigo_canvas',
    shoesId: 'retro_chunky_sneakers',
    accessoryId: 'tui_crossbody_harness',
    mainColor: '#FAF8F5', // Raw ivory đũi wild silk!
    innerColor: '#FAF8F5',
    bottomColor: '#1E1B4B', // Midnight indigo
    isOpenOuterwear: false, // Right-flapped closure with open hip drape!
    lapelDirection: 'right',
    harmonyScore: 99
  },
  {
    id: 'preset_nhat_binh_fusion',
    title: 'Haute Couture Dáng Dài · Áo Nhật Bình (21 tuổi)',
    tagline: 'Áo Nhật Bình outerwear đối khâm dải ngũ sắc phủ ngoài Denim Y2K và kính oval',
    persona: 'Gen Z Creator / Visual Artist (21 tuổi)',
    event: 'Tuần Lễ Thời Trang & Triển Lãm Đương Đại',
    weather: 'Studio Octabox Neutral 22°C',
    mainGarmentId: 'nhat_binh',
    innerGarmentId: 'graphic_tee_y2k',
    bottomGarmentId: 'quan_jeans_thung_y2k',
    shoesId: 'retro_chunky_sneakers',
    accessoryId: 'kinh_mat_oval_y2k',
    mainColor: '#C2410C', // Đỏ gốm
    innerColor: '#18181B',
    bottomColor: '#3B82F6',
    isOpenOuterwear: true, // Mở tà làm áo khoác!
    lapelDirection: 'right',
    harmonyScore: 96
  },
  {
    id: 'preset_kinh_bac_contemporary',
    title: 'Kinh Bắc Contemporary · Tứ Thân & Thổ Cẩm',
    tagline: 'Áo Tứ Thân buông vạt lụa điều phối cùng chân váy xếp ly dáng dài và boots da',
    persona: 'Contemporary Fashion Stylist',
    event: 'Không Gian Trưng Bày Mỹ Thuật Bản Địa',
    weather: 'Trời mát dịu 24°C',
    mainGarmentId: 'tu_than',
    innerGarmentId: 'yem_dao_sen',
    bottomGarmentId: 'chan_vay_xep_ly_midi',
    shoesId: 'boots_da_co_thap',
    accessoryId: 'tui_tho_cam_hmong',
    mainColor: '#15803D', // Lục bích
    innerColor: '#FDA4AF',
    bottomColor: '#1C1917',
    isOpenOuterwear: false,
    lapelDirection: 'right',
    harmonyScore: 95
  },
  {
    id: 'preset_lemur_dandy',
    title: 'Hà Thành 1930s · Neo-Vintage Dandy',
    tagline: 'Áo Lemur tân thời tay phồng viền ren đi cùng quần âu xếp ly và Loafers da bóng',
    persona: 'Heritage Archivist & Designer',
    event: 'Phòng Lưu Trữ Nghệ Thuật Đông Dương',
    weather: 'Ánh sáng nghệ thuật 20°C',
    mainGarmentId: 'lemur_tan_thoi',
    innerGarmentId: 'minimal_mockneck',
    bottomGarmentId: 'quan_au_pleated_retro',
    shoesId: 'loafer_da_bong_chunky',
    accessoryId: 'khan_van_nhung',
    mainColor: '#831843', // Mận chín
    innerColor: '#FAF8F5',
    bottomColor: '#78716C',
    isOpenOuterwear: false,
    lapelDirection: 'right',
    harmonyScore: 97
  }
];

// 8. Cultural Guardrail Rules Engine
export interface GuardrailCheck {
  status: 'optimal' | 'notice' | 'warning';
  title: string;
  message: string;
  advice: string;
  code: string;
}

export function evaluateCulturalGuardrails(
  mainGarment: GarmentItem,
  innerGarment: GarmentItem,
  bottomGarment: GarmentItem,
  lapelDirection: 'right' | 'left',
  eventContext: string,
  isOpenOuterwear: boolean
): GuardrailCheck[] {
  const checks: GuardrailCheck[] = [];

  // Check 1: Lapel direction (Hữu nhậm vs Tả nhậm)
  if (lapelDirection === 'left') {
    checks.push({
      status: 'warning',
      code: 'TA_NHAM_ALERT',
      title: 'Cảnh báo Quy chuẩn Vạt Áo (Hữu Nhậm)',
      message: 'Bạn đang cài vạt áo sang bên trái (Tả nhậm). Theo quy chuẩn phục sức luân lý Á Đông cổ truyền, vạt áo của người sống luôn cài sang bên phải (Hữu nhậm).',
      advice: 'Tránh cài vạt sang trái vì vốn gắn với nghi thức tang tế/khâm liệm thời xưa. Nhấp nút chuyển sang "Cài vạt bên phải (Hữu nhậm)" để chuẩn mực hơn!'
    });
  } else {
    checks.push({
      status: 'optimal',
      code: 'HUU_NHAM_OK',
      title: 'Chuẩn mực Vạt Áo Hữu Nhậm',
      message: 'Vạt áo cài bên phải đúng theo tinh thần Đạo học và quy chuẩn y phục dân tộc.',
      advice: 'Giữ trọn đạo lý sống và sự tao nhã truyền đời.'
    });
  }

  // Check 2: Event context vs garment exposure
  const isSacredEvent = eventContext.includes('Chùa') || eventContext.includes('Đền') || eventContext.includes('Miếu') || eventContext.includes('Tế Lễ');
  if (isSacredEvent) {
    if (innerGarment.id === 'yem_dao_sen' && isOpenOuterwear) {
      checks.push({
        status: 'warning',
        code: 'SACRED_EXPOSURE',
        title: 'Nhắc nhở Không Gian Trang Nghiêm',
        message: 'Bạn đang chọn bối cảnh nơi thờ tự linh thiêng nhưng lại mặc yếm hở và mở bung tà áo ngoài.',
        advice: 'Mách nhỏ: Tại chốn thiền môn, hãy cài cúc kín đáo hoặc phối thêm áo lót cổ tròn để giữ sự tôn kính trang nghiêm.'
      });
    }
  }

  // Check 3: Royal pattern in casual street context
  if (mainGarment.id === 'nhat_binh' && bottomGarment.id === 'quan_jeans_thung_y2k') {
    checks.push({
      status: 'notice',
      code: 'ROYAL_CASUAL_FUSION',
      title: 'Mách nhỏ: Giao thoa Hoàng tộc & Đường phố',
      message: 'Áo Nhật bình vốn là y phục của bậc Hoàng phi quý tộc cung đình Triều Nguyễn.',
      advice: 'Khi remix cùng quần jeans rách, hãy giữ tinh thần tôn trọng bằng cách giữ nguyên dải ngũ hành cổ tay áo, bạn đang tạo nên phong cách Haute Couture đường phố rất ấn tượng!'
    });
  }

  // Check 4: Five buttons meaning
  if (mainGarment.subType === 'ngu_than') {
    checks.push({
      status: 'optimal',
      code: 'NGU_THUONG_VALUE',
      title: 'Ý nghĩa Đạo làm người (Ngũ Thường)',
      message: 'Áo ngũ thân của bạn có 5 cúc đại diện cho Nhân - Lễ - Nghĩa - Trí - Tín.',
      advice: 'Cúc áo trên ngực tượng trưng cho Nhân (lòng nhân ái), cúc thứ hai là Lễ (sự khiêm nhường), cúc thứ ba là Nghĩa (chính trực), cúc thứ tư là Trí (sáng suốt), cúc thứ năm là Tín (giữ trọn lời hứa).'
    });
  }

  return checks;
}

// 9. Harmony Score Calculation (0-100)
export function calculateHarmonyScore(
  mainGarment: GarmentItem,
  innerGarment: GarmentItem,
  bottomGarment: GarmentItem,
  shoes: GarmentItem,
  accessory: GarmentItem,
  lapelDirection: 'right' | 'left',
  isOpenOuterwear: boolean
): { score: number; heritageScore: number; fusionScore: number; colorScore: number; summary: string } {
  let heritageScore = 85;
  let fusionScore = 80;
  let colorScore = 90;

  // Lapel penalty
  if (lapelDirection === 'left') {
    heritageScore -= 30;
  } else {
    heritageScore += 10;
  }

  // Fusion bonus
  if (isOpenOuterwear && mainGarment.id === 'nhat_binh') {
    fusionScore += 15; // Outerwear cardigan remix
  }
  if (bottomGarment.id === 'quan_jeans_thung_y2k' || shoes.id === 'retro_chunky_sneakers') {
    fusionScore += 10;
  }
  if (accessory.id === 'kinh_mat_oval_y2k' || accessory.id === 'tui_tho_cam_hmong') {
    fusionScore += 8;
  }

  // Pure classic check
  const isPureClassic = bottomGarment.id === 'quan_lua_suong_trang' && shoes.id === 'hai_theu_hoa_sen' && !isOpenOuterwear;
  if (isPureClassic) {
    heritageScore = 100;
    fusionScore = 75; // classic fidelity
  }

  heritageScore = Math.min(100, Math.max(30, heritageScore));
  fusionScore = Math.min(100, Math.max(40, fusionScore));
  colorScore = Math.min(100, Math.max(60, colorScore));

  const score = Math.round((heritageScore * 0.45) + (fusionScore * 0.35) + (colorScore * 0.20));

  let summary = 'Bản phối hài hòa ấn tượng! Vừa gìn giữ trọn vẹn nét tôn nghiêm của di sản, vừa thể hiện cá tính thời trang đường phố tự tin.';
  if (score >= 95) {
    summary = 'Tuyệt tác Hòa Sắc & Di Sản! Sự hòa quyện hoàn hảo giữa hồn cốt trăm năm và nhịp đập Gen Z đương đại.';
  } else if (score < 80) {
    summary = 'Cần lưu ý một số quy chuẩn vạt áo hoặc cách phối để bộ đồ toát lên trọn vẹn khí chất tao nhã.';
  }

  return { score, heritageScore, fusionScore, colorScore, summary };
}
