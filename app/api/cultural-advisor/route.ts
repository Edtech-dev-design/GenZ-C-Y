import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      eventContext,
      mainGarment,
      innerGarment,
      bottomGarment,
      shoes,
      accessory,
      lapelDirection,
      isOpenOuterwear
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback response generator if API key is not configured or in sandbox
    const generateLocalAdvice = () => {
      const isSacred = (eventContext || '').includes('Chùa') || (eventContext || '').includes('Đền');
      let adviceText = `Lời khuyên từ Cố Vấn Văn Hóa & Phong Cách Việt Phục:\n\n`;

      adviceText += `1. **Đánh Giá Cấu Trúc Tổng Thể**: Bạn đang chọn ${mainGarment?.name || 'Áo Ngũ Thân'} phối cùng ${bottomGarment?.name || 'Quần Jeans'} và ${shoes?.name || 'Sneakers'}. `;
      if (isOpenOuterwear) {
        adviceText += `Việc mặc theo dạng outerwear mở tà tạo nên sự phóng khoáng rất hợp gu Gen Z hiện đại, để lộ lớp lót bên trong theo quy tắc "trong lộ ngoài ẩn" cổ phong.\n\n`;
      } else {
        adviceText += `Việc cài cúc chỉnh tề giúp giữ trọn cốt cách nho nhã và sự kín đáo theo phong thái người xưa.\n\n`;
      }

      if (lapelDirection === 'left') {
        adviceText += `2. **Lưu Ý Quy Chuẩn Vạt Áo**: Bạn đang chọn cài vạt áo bên trái (Tả nhậm). Trong văn hóa phục trang truyền thống Việt Nam, vạt áo luôn cài sang bên phải (Hữu nhậm) để biểu trưng cho sự sống và đạo làm người. Bạn nên chuyển sang Hữu nhậm nhé!\n\n`;
      } else {
        adviceText += `2. **Chuẩn Mực Vạt Áo Hữu Nhậm**: Rất tuyệt! Vạt áo cài bên phải đúng theo tinh thần Đạo học và quy thức y phục tổ tiên.\n\n`;
      }

      adviceText += `3. **Gợi Ý Bối Cảnh (${eventContext || 'Dạo phố'})**: `;
      if (isSacred) {
        adviceText += `Tại chốn trang nghiêm đền miếu, hãy ưu tiên các gam màu trầm nhã như lam chàm hoặc xanh lục, tránh các chi tiết quá hở để tôn vinh sự thanh tịnh.\n\n`;
      } else {
        adviceText += `Với sự kiện này, bản phối của bạn đã cân bằng hoàn hảo giữa tính di sản và chất chơi đường phố. Bạn có thể nhấn thêm chiếc túi thổ cẩm Tây Bắc hoặc kính râm oval để có những bức ảnh lookbook triệu like!`;
      }

      return adviceText;
    };

    if (!apiKey) {
      return NextResponse.json({
        text: generateLocalAdvice(),
        source: 'local_engine'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Bạn là Trợ Lý Cố Vấn Văn Hóa & Phong Cách Thời Trang Việt Phục Remix dành cho giới trẻ Gen Z. 
Nhiệm vụ của bạn là đưa ra lời khuyên ngắn gọn, sắc bén, đầy cảm hứng tự hào dân tộc nhưng trẻ trung, không giáo điều, không sáo rỗng.
Các kiến thức cần nắm:
- Áo ngũ thân (thời Nguyễn): 5 thân áo (tứ thân phụ mẫu + thân con), 5 hạt cúc (Nhân - Lễ - Nghĩa - Trí - Tín), quy tắc hữu nhậm (cài vạt phải).
- Áo Nhật bình: Đối khâm chữ nhật, dải ngũ sắc ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ), thường phục hoàng tộc.
- Áo tứ thân: 4 vạt áo, thắt lưng điều Kinh Bắc, áo yếm lót.
- Áo Lemur: Thập niên 1930 của họa sĩ Cát Tường, cổ cánh sen, tay phồng đăng-ten.
- Tinh thần Remix: Kết hợp di sản với streetwear (quần jeans, sneakers, kính oval, túi thổ cẩm).`;

    const userPromptText = `Hãy tư vấn bản phối sau cho người dùng:
- Bối cảnh sự kiện: ${eventContext || 'Dạo phố'}
- Yêu cầu người dùng: ${prompt || 'Đánh giá độ hòa hợp và gợi ý nâng cấp outfit'}
- Áo chính: ${mainGarment?.name || 'Áo Ngũ Thân'} (${isOpenOuterwear ? 'Khoác ngoài mở tà' : 'Cài cúc hoàn chỉnh'}, Hướng vạt: ${lapelDirection === 'right' ? 'Hữu nhậm (Phải)' : 'Tả nhậm (Trái)'})
- Lớp lót: ${innerGarment?.name || 'Yếm'}
- Phần dưới: ${bottomGarment?.name || 'Quần'}
- Giày: ${shoes?.name || 'Sneakers'}
- Phụ kiện: ${accessory?.name || 'Kính mát'}

Hãy đưa ra nhận xét gồm:
1. Nhận xét thẩm mỹ & điểm sáng tạo
2. Cảnh báo hoặc gợi ý văn hóa (Cultural Guardrail) nếu có
3. Tips chụp ảnh lookbook / tạo dáng chuẩn Gen Z`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPromptText,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 800
      }
    });

    return NextResponse.json({
      text: response.text || generateLocalAdvice(),
      source: 'gemini'
    });
  } catch (error) {
    console.error('Cultural Advisor API error:', error);
    return NextResponse.json({
      text: 'Bản phối của bạn rất cá tính và thể hiện tinh thần sáng tạo của người trẻ! Hãy chú ý cài vạt áo bên phải (Hữu nhậm) và giữ sự hài hòa giữa màu sắc ngũ hành tương sinh.',
      source: 'fallback'
    });
  }
}
