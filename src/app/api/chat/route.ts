import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "المقصد مطلوب" }, { status: 400 });
    }

    const systemPrompt = `أنت "مساعد نواة" — المساعد الذكي الرسمي لمنصة (نواة | NAWAH)، المنصة الوطنية لتتبع وإدارة وتدوير نوى التمر وتطبيقات الاقتصاد الدائري في المملكة العربية السعودية.
مهامك:
- الإجابة على استفسارات المستخدمين حول نوى التمر، طرق الجمع، التجفيف، ونسب الرطوبة.
- شرح مسارات الاستفادة التحويلية: الفحم المنشط وتصفية المياه، استخلاص الزيوت للمستحضرات التجميلية، بدائل القهوة الخالية من الكافيين، والأعلاف المجهزة.
- مساعدة الباحثين والمصانع في كيفية تسجيل الدفعات برقم NW فريد، وإجراء التجارب برقم EXP، ومتابعة مؤشرات الأثر البيئي (كمية النفايات المحولة وبصمة الكربون).
- التحدث بأسلوب رسمي، احترافي، ودود باللغة العربية، والالتزام بالحقائق التقنية العلمية دون ادعاء دراسات أو أرقام وهمية غير موجودة.`;

    if (!genAI) {
      // Intelligent fallback when GEMINI_API_KEY is not set
      const fallbackReply = generateFallbackReply(message);
      return NextResponse.json({ reply: fallbackReply });
    }

    try {
      const formattedHistory = Array.isArray(history) 
        ? history.filter((msg: any) => msg.content).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          }))
        : [];

      // Primary model attempt (Gemini 2.5/1.5 Flash)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "أهلاً بك! أنا مساعد نواة الذكي، خبير منصة (نواة | NAWAH) لإدارة وتدوير نوى التمر في المملكة. كيف يمكنني مساعدتك اليوم؟" }] },
          ...formattedHistory
        ],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ reply: text });
    } catch (aiError: any) {
      console.warn("Gemini API call failed, using intelligent NAWAH Assistant fallback:", aiError.message);
      const fallbackReply = generateFallbackReply(message);
      return NextResponse.json({ reply: fallbackReply });
    }

  } catch (error: unknown) {
    console.error("Chat Route Error:", error);
    return NextResponse.json(
      { reply: "تعذر تشغيل خدمة المساعد الذكي حالياً، يرجى إعادة المحاولة بعد قليل." },
      { status: 200 }
    );
  }
}

function generateFallbackReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('دفعة') || msg.includes('تسجيل') || msg.includes('كود') || msg.includes('nw')) {
    return "لتسجيل دفعة نوى جديدة في منصة نواة، انتقل إلى قسم (إدارة النوى) ثم اضغط على (تسجيل دفعة جديدة). سيقوم النظام تلقائياً بتوليد كود تتبع فريد بنمط NW-2026-XXXX، وتوثيق المصدر والكمية بالكيلوجرام ونسبة الرطوبة وطريقة التجفيف.";
  }
  if (msg.includes('فحم') || msg.includes('تصفية') || msg.includes('مياه') || msg.includes('كربون')) {
    return "مسار الفحم المنشط (Activated Carbon) يُعد من أعلى المسارات قيمة لنوى التمر؛ حيث خضعت النوى للتحليل الحراري بمعزل عن الأكسجين لإنتاج فحم عالي الامتصاص يُستخدم في تصفية الفلزات الثقيلة ومياه الصرف الصناعي وفق الأبحاث المعتمدة.";
  }
  if (msg.includes('زيت') || msg.includes('تجميل') || msg.includes('مستحضر')) {
    return "مسار استخلاص زيت نواة التمر (Date Seed Oil) يتم عبر العصر على البارد لاستخراج الزيت الغني بمضادات الأكسدة والأحماض الدهنية الأساسية (مثل الأوليك واللينوليك) لاستخدامه في كريمات ومستحضرات التجميل العضوية.";
  }
  if (msg.includes('قهوة') || msg.includes('كافيين') || msg.includes('مشروب')) {
    return "بديل القهوة الخالي من الكافيين يتم تحضيره بتحميص وتجفيف وطحن نوى التمر بدرجات حرارة مخصصة، ليعطي نكهة زكية تشبه البن العربي الأصيل بدون أي نسبة كافيين، مما يجعله منتجاً استهلاكياً بيئياً مرغوباً.";
  }
  if (msg.includes('تحليل') || msg.includes('صورة') || msg.includes('كاميرا') || msg.includes('رطوبة')) {
    return "يمكنك استخدام قسم (تحليل النواة) لالتقاط أو رفع صورة لشحنة النوى؛ حيث يستخرج نظام الرؤية الحاسوبية الخصائص البصرية والشوائب وتجانس التحميص. ننصح دائماً بإرفاق فحص معملي دقيق لنسبة الرطوبة والتركيب الكيميائي.";
  }
  if (msg.includes('تجربة') || msg.includes('مختبر') || msg.includes('exp')) {
    return "قسم (سجل التجارب) يتيح للباحثين والمختبرات تسجيل أي اختبار تحويلي تجريبي على الدفعات برقم مخصص EXP-2026-XXXX، وتوثيق كمية النوى المستخدمة والنتائج والأثر المترتب عليها.";
  }
  
  return "أهلاً بك في منصة (نواة | NAWAH). أنا مساعد نواة الذكي لإرشادك في إدارة وتتبع وتسجيل دفعات نوى التمور، واكتشاف مسارات الاستفادة التحويلية (كالفحم المنشط، الزيوت التجميلية، وبدائل القهوة)، وتتبع الأثر البيئي والاقتصادي. كيف يمكنني إجابتك حول مشروعك اليوم؟";
}
