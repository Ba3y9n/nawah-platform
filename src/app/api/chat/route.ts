import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

function getGeminiClient(): GoogleGenerativeAI | null {
  let key = (process.env.GEMINI_API_KEY || "").replace(/\0/g, "").trim();
  if (!key && typeof window === "undefined") {
    try {
      if (fs.existsSync(".env")) {
        const content = fs.readFileSync(".env", "utf-16le");
        const match = content.match(/GEMINI_API_KEY=(.*)/);
        if (match) key = match[1].replace(/\0/g, "").trim();
      }
    } catch (e) {
      // Ignore fallback read errors
    }
  }
  return key ? new GoogleGenerativeAI(key) : null;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 });
    }

    const systemPrompt = `أنت "مساعد نواة" — الخبير والمساعد الذكي الرسمي لمنصة (نواة | NAWAH)، المنصة الوطنية لتتبع وتدوير نوى التمر وتطبيقات الاقتصاد الدائري في المملكة العربية السعودية.

قواعد الاستجابة الصارمة:
1. التخصص التام: إجاباتك محصورة في نوى التمر، الاقتصاد الدائري، تتبع الدفعات (NW)، سجل التجارب (EXP)، مسارات الاستفادة التحويلية، والأدلة الرسمية والمعملية.
2. التمييز الواضح في المفاهيم:
   - فرق دائماً بين "مسار محتمل / Potential Use" و "نتيجة مثبتة وموثقة / Validated Result".
   - لا تحوّل الاحتمال أو الفكرة البحثية إلى حقيقة علمية قطعية بدون مصدر.
   - عند ذكر أي أرقام بيئية أو تقديرية، وضح أنها "تقدير نظري / حسابي".
3. الأمان والدقة العلمية:
   - لا تخترع أبحاثاً، مصادر، أسماء علماء، أو أرقاماً غير موجودة.
   - إذا لم تتوفر لديك معلومة مؤكدة أو كانت تتطلب فحصاً مخبرياً دقيقاً (كالرطوبة الحقيقية، التركيب الكيميائي، أو السلامة الميكروبية)، اذكر بوضوح: "هذه المعلومة تتطلب اختباراً مخبرياً معتمداً أو مصدر موثق".
4. الأسلوب: رسمي، احترافي، ودود، باللغة العربية، وواضح ومباشر.`;

    const genAI = getGeminiClient();

    if (!genAI) {
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

      // Use gemini-3.6-flash model as required
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "أهلاً بك! أنا مساعد نواة الذكي، خبير منصة (نواة | NAWAH) لإدارة وتدوير نوى التمر وتطبيقات الاقتصاد الدائري. كيف يمكنني إجابتك اليوم؟" }] },
          ...formattedHistory
        ],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ reply: text });
    } catch (aiError: any) {
      console.warn("Gemini 3.6 Flash Chat API warning, using local assistant fallback:", aiError?.message || aiError);
      const fallbackReply = generateFallbackReply(message);
      return NextResponse.json({ reply: fallbackReply });
    }

  } catch (error: unknown) {
    console.error("Chat Route Error:", error);
    return NextResponse.json(
      { reply: "تعذر التواصل مع المساعد الذكي حالياً، يرجى المحاولة بعد قليل." },
      { status: 200 }
    );
  }
}

function generateFallbackReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('دفعة') || msg.includes('تسجيل') || msg.includes('كود') || msg.includes('nw')) {
    return "لتسجيل دفعة نوى جديدة في منصة نواة، يمكنك الانتقال إلى قسم (إدارة النوى) ثم (تسجيل دفعة جديدة). سيصدر النظام كود تتبع فريد NW-2026-XXXX لربط الدفعة لاحقاً بالتحليل البصري والتجارب المخبرية وسجل الأثر.";
  }
  if (msg.includes('فحم') || msg.includes('تصفية') || msg.includes('مياه') || msg.includes('كربون')) {
    return "مسار إنتاج الفحم المنشط (Activated Carbon) يُعد من مسارات الاستفادة المحتملة ذات القيمة العالية، حيث تتم المعالجة بالتحليل الحراري ثم التنشيط البخاري أو الكيميائي لإنتاج فحم بمساحة سطحية تتجاوز 1000 م²/غم لاستخدامه في تنقية المياه وتصفية الفلزات وفق الأبحاث المعتمدة.";
  }
  if (msg.includes('زيت') || msg.includes('تجميل') || msg.includes('مستحضر')) {
    return "مسار استخلاص زيت نوى التمر (Date Seed Oil) يمثل مساراً محتملاً في مستحضرات التجميل العضوية؛ نظراً لاحتوائه على حمض الأولييك والتوكوفيرول (فيتامين E). ويتطلب تأكيد الصلاحية إجراء فحوصات حموضة وبيروكسيد معملية.";
  }
  if (msg.includes('قهوة') || msg.includes('كافيين') || msg.includes('مشروب')) {
    return "بديل القهوة الخالي من الكافيين هو مسار محتمل يعتمد على تحميص وطحن نوى التمر المغسولة والمجففة. يتطلب تحضير هذا المنتج التأكد من السلامة الميكروبولوجية والخلو التام من ألياف التمر السكرية لتجنب الاحتراق أثناء التحميص.";
  }
  if (msg.includes('تحليل') || msg.includes('صورة') || msg.includes('كاميرا') || msg.includes('رطوبة')) {
    return "يوفر قسم (التحليل البصري) فحصاً بصرية تقديرياً لاستخراج الخصائص السطحية ومؤشر الشوائب والتجانس. تنبيه هام: الفحص البصري التقديري لا يغني عن الفحوصات المعملية المعتمِدة لتحديد نسبة الرطوبة والتركيب الكيميائي ودقة السلامة الميكروبية.";
  }
  if (msg.includes('تجربة') || msg.includes('مختبر') || msg.includes('exp')) {
    return "سجل التجارب في منصة نواة يربط الدفعة (NW) بالفرضية البحثية والمخرج التجريبي وتوثيق النتيجة (EXP). يساعدك هذا السجل على تحويل المسار المحتمل إلى نتيجة مثبتة وموثقة بالأدلة.";
  }
  
  return "أهلاً بك في منصة (نواة | NAWAH). أنا مساعد نواة الذكي لإرشادك في إدارة وتتبع وتدوير نوى التمر، واكتشاف مسارات الاستفادة المحتملة، وتوثيق التجارب والأدلة العلمية. كيف يمكنني مساعدتك اليوم؟";
}
