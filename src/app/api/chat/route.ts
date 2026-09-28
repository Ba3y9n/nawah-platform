import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

function getGeminiClient(): GoogleGenerativeAI | null {
  const key = (process.env.GEMINI_API_KEY || "").trim();
  return key ? new GoogleGenerativeAI(key) : null;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 });
    }

    const genAI = getGeminiClient();

    if (genAI) {
      try {
        let formattedHistory = Array.isArray(history)
          ? history.filter((msg: any) => (msg.content || msg.text)).map((msg: any) => ({
              role: (msg.role === "user" || msg.sender === "user") ? ("user" as const) : ("model" as const),
              parts: [{ text: String(msg.content || msg.text) }],
            }))
          : [];

        // Google Gemini requirement: The first message in history MUST be from 'user'
        while (formattedHistory.length > 0 && formattedHistory[0].role !== "user") {
          formattedHistory.shift();
        }

        // Drop the last message if it's identical to the new incoming message (to avoid duplicate user turns)
        if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === "user") {
          formattedHistory.pop();
        }

        const systemPrompt = `أنت "مساعد نواة الذكي" — الخبير والمستشار التقني لمنصة (نواة | NAWAH)، المنصة الوطنية لإدارة وتدوير نوى التمر وتطبيقات الاقتصاد الدائري في المملكة العربية السعودية.

أجب على سؤال المستخدم باللغة العربية بدقة ووضوح وذكاء:
- إذا كان السؤال عن المنصة، وضّح الأقسام (الخريطة الذكية، إدارة الدفعات NW، الفاحص البصري الذكي، سجل التجارب EXP، وحساب انبعاثات الكربون).
- إذا كان عن الصناعات والمسارات، اشرح تفاصيل الفحم المنشط، زيت نوى التمر، بديل القهوة، الأعلاف، أو البوليمرات الحيوية.
- قدّم خطوات عملية واضحة وأسلوب مشجع ومهني.`;

        const candidateModels = [
          "gemini-2.5-flash",
          "gemini-flash-latest",
          "gemini-2.5-flash-lite",
          "gemini-2.5-pro",
          "gemini-pro-latest"
        ];

        let text = "";
        for (const modelName of candidateModels) {
          try {
            const model = genAI.getGenerativeModel({ 
              model: modelName,
              systemInstruction: systemPrompt 
            });

            const chat = model.startChat({
              history: formattedHistory,
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            text = response.text();
            if (text && text.trim().length > 0) {
              break;
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} warning:`, modelErr?.message?.substring(0, 100));
            continue;
          }
        }

        if (text && text.trim().length > 0) {
          return NextResponse.json({ reply: text });
        }
      } catch (aiError: any) {
        console.warn("Gemini Live Chat warning, using smart internal engine:", aiError?.message || aiError);
      }
    }

    // Smart semantic knowledge engine for Date Pit & Nawah platform
    const smartReply = generateComprehensiveReply(message);
    return NextResponse.json({ reply: smartReply });

  } catch (error: unknown) {
    console.error("Chat Route Error:", error);
    return NextResponse.json(
      { reply: "أهلاً بك! مساعد نواة جاهز للإجابة عن أسئلتك حول نوى التمر وإدارة الدفعات والمسارات الصناعية." },
      { status: 200 }
    );
  }
}

function generateComprehensiveReply(userMessage: string): string {
  const msg = userMessage.trim().toLowerCase();

  // 1. التسجيل والدفعات
  if (msg.includes('دفعة') || msg.includes('دفعات') || msg.includes('تسجيل') || msg.includes('كود') || msg.includes('nw') || msg.includes('شحنة') || msg.includes('كمية')) {
    return `📌 **خطوات تسجيل دفعة نوى جديدة في منصة نواة:**

1. من القائمة العلوية، توجه إلى **إدارة النوى** ثم اختر **دفعات النوى** (أو من الرابط السريع: \`/pit-management/batches\`).
2. اضغط على زر **«تسجيل دفعة جديدة»**.
3. أدخل البيانات الأساسية:
   - اسم المصنع أو المزرعة المورّدة.
   - المنطقة الجغرافية (القصيم، الرياض، الأحساء، المدينة المنورة، الخ).
   - الوزن الإجمالي بالكيلوغرام أو الطن.
   - نوع التمر ومستوى التجفيف الأولي.
4. يولد النظام فوراً **كود تتبع وطني فريد** (مثال: \`NW-2026-8821\`) يُمكّنك من ربط الدفعة بالفحص البصري وسجل التجارب ومؤشرات الأثر البيئي.`;
  }

  // 2. الفحم المنشط
  if (msg.includes('فحم') || msg.includes('منشط') || msg.includes('كربون') || msg.includes('تصفية') || msg.includes('تنقية') || msg.includes('مياه') || msg.includes('غاز')) {
    return `🔥 **مسار إنتاج الفحم المنشط (Activated Carbon) من نوى التمر:**

• **القيمة الصناعية:** يُعد من أعلى المسارات عائداً؛ حيث يتميز نوى التمر بصلابة بنائية وكثافة كربونية ممتازة.
• **طريقة المعالجة:**
  1. التحليل الحراري (Pyrolysis) عند درجات حرارة بين 500 - 700 درجة مئوية في غياب الأكسجين.
  2. التنشيط (Activation) بالبخار أو كيميائياً (مثل حمض الفوسفوريك أو كلوريد الزنك) لخلق مسامات نانوية فائقة الدقة.
• **المواصفات الناتجة:** مساحة سطحية تتجاوز **1000 - 1400 م²/غم**.
• **الاستخدامات المباشرة:** محطات تحلية وتنقية المياه، تنقية الغازات الصناعية، تصفية الفلزات الثقيلة، والكمامات والفلاتر الطبية.`;
  }

  // 3. زيت نوى التمر
  if (msg.includes('زيت') || msg.includes('دهن') || msg.includes('تجميل') || msg.includes('بشرة') || msg.includes('مستحضر') || msg.includes('استخلاص')) {
    return `💧 **مسار استخلاص زيت نوى التمر (Date Seed Oil):**

• **نسبة الزيت الطبيعية:** يحتوي نوى التمر على نسبة دهون تتراوح بين **8% إلى 12%**.
• **الخصائص والتركيب:**
  - غني بالأحماض الدهنية غير المشبعة (حمض الأوليك Oleic وحمض اللينوليك).
  - يحتوي على تركيز عالٍ من فيتامين E (Tocopherols) والمواد المضادة للأكسدة الفينولية.
• **طرق الاستخلاص:** العصر الميكانيكي على البارد (Cold Press) أو المذيبات العضوية الخضراء كغاز ثاني أكسيد الكربون فوق الحرج (Supercritical CO2).
• **التطبيقات:** مستحضرات العناية بالبشرة والشعر، تصنيع الصابون الطبيعي الفاخر، ومكملات مضادات الأكسدة.`;
  }

  // 4. بديل القهوة
  if (msg.includes('قهوة') || msg.includes('كافيين') || msg.includes('مشروب') || msg.includes('تحميص') || msg.includes('طحن')) {
    return `☕ **مسار بديل القهوة الخالي من الكافيين:**

• **المميزات:** مشروب طبيعي 100% غني بالألياف ومضادات الأكسدة وبدون أي نسبة كافيين، مما يجعله مثالياً لمرضى الضغط ومحبي البدائل الصحية.
• **مراحل الإنتاج:**
  1. **الغسيل الدقيق:** إزالة أي ألياف تمر أو بقايا سكرية تماماً لمنع الاحتراق أثناء التحميص.
  2. **التجفيف:** خفض الرطوبة لأقل من 8%.
  3. **التحميص:** تحميص هوائي مضبوط بين 180 - 210 مئوية للوصول إلى النكهة المميزة.
  4. **الطحن والفلترة:** طحن بدرجات نعومة تناسب القهوة المقطرة أو العربية.`;
  }

  // 5. الفاحص البصري والذكاء الاصطناعي
  if (msg.includes('فحص') || msg.includes('تحليل') || msg.includes('سكانر') || msg.includes('كاميرا') || msg.includes('ذكاء') || msg.includes('رؤية') || msg.includes('صورة') || msg.includes('scanner')) {
    return `🔍 **الفاحص البصري الذكي لنوى التمر (AI Scanner):**

• **آلية العمل:** يعتمد على نماذج الرؤية الحاسوبية (Computer Vision) من Google Gemini لتحليل صور شحنات النوى فور التقاطها.
• **المؤشرات المستخرجة:**
  - **مؤشر الشوائب السطحية:** رصد القشور والألياف والشوائب المرئية.
  - **درجة التجانس اللوني والبنائي:** تقييم جودة الدفعة واستقرار الحجم.
  - **اقتراح المسار الأمثل:** توجيه الشحنة آلياً للمسار الأنسب (فحم، استخلاص زيوت، أو بدائل غذائية).
• **تنبيه علمي:** الفحص البصري هو مؤشر تقديري أولي للمظهر السطحي، وتوصي المنصة باستكمال الاختبارات المعملية لتحديد الرطوبة المخبرية والتركيب الكيميائي الدقيق.`;
  }

  // 6. الخريطة الذكية
  if (msg.includes('خريطة') || msg.includes('مصنع') || msg.includes('مصانع') || msg.includes('موقع') || msg.includes('قصيم') || msg.includes('أحساء') || msg.includes('رياض') || msg.includes('مدينة') || msg.includes('map')) {
    return `🗺️ **الخريطة الذكية لمنصة نواة (Smart Map):**

• **الهدف:** بناء شبكة جغرافية حية تربط مصانع التمور ومراكز التجميع بمصانع التدوير والمختبرات.
• **المناطق المغطاة:**
  - **القصيم:** أكثر من 8 مصانع كبرى ومراكز فرز بطاقة إنتاج نوى تتجاوز آلاف الأطنان سنوياً.
  - **الأحساء:** مزارع النخيل ومصانع تعبئة التمور الشرقية.
  - **الرياض والخرج:** مراكز التصنيع والتوزيع اللوجستي.
  - **المدينة المنورة وجيزان وحائل:** نقاط توريد متجددة.
• يمكنك زيارة صفحة الخريطة من القائمة العلوية للاطلاع على مواقع المصانع وطلب كميات التوريد مباشرة.`;
  }

  // 7. الأثر البيئي وحساب الكربون
  if (msg.includes('أثر') || msg.includes('كربون') || msg.includes('بيئة') || msg.includes('مستدامة') || msg.includes('وفر') || msg.includes('co2') || msg.includes('طاقة') || msg.includes('2030')) {
    return `🌱 **مؤشرات الأثر البيئي والاقتصاد الدائري في نواة:**

• **خفض انبعاثات الكربون (CO2 Avoidance):** يمنع تدوير كل طن من نوى التمر انبعاثات الميثان والكربون الناتجة عن الطمر أو الحرق التقليدي بمعدل يقارب **1.4 طن CO2eq لكل طن نوى**.
• **حفظ الموارد:** استبدال الأخشاب والفحم الحجري التقليدي بفحم نوى التمر المستدام، مما يحافظ على الغطاء النباتي الطبيعي.
• **المواءمة مع رؤية 2030:** تحقيق مستهدفات مبادرة السعودية الخضراء (SGI) والوصول إلى صفر نفايات عضوية وتحويلها لاقتصاد معرفي مستدام.`;
  }

  // 8. سجل التجارب والدليل العلمي
  if (msg.includes('تجربة') || msg.includes('تجارب') || msg.includes('مختبر') || msg.includes('دليل') || msg.includes('أبحاث') || msg.includes('مصدر') || msg.includes('exp') || msg.includes('بحث')) {
    return `📚 **سجل التجارب والدليل العلمي (Evidence & Experiments):**

• **سجل التجارب (EXP):** أداة مخصصة لفرق البحث والتطوير والمصانع لتوثيق الفرضية، طريقة المعالجة، ونسبة العائد الفعلي للدفعة.
• **الأدلة والمصادر:** توفر المنصة مراجع معتمدة محكمة حول:
  - التحليل الكيميائي لنوى التمر السعودي (رطوبة، رماد، ألياف، بروتين).
  - دراسات الجدوى الفنية لإنتاج الفحم المنشط والزيوت العضوية.
• يمكنك الاطلاع على الأوراق العلمية والأدلة عبر صفحة **«الأدلة والمصادر»** في القائمة العلوية.`;
  }

  // 9. عن المنصة أو المساعد
  if (msg.includes('من أنت') || msg.includes('مين انت') || msg.includes('نواة') || msg.includes('منصة') || msg.includes('هدف') || msg.includes('فكرة') || msg.includes('السلام') || msg.includes('مرحبا') || msg.includes('أهلا') || msg.includes('هلا')) {
    return `أهلاً وسهلاً بك! 👋🌴

أنا **«مساعد نواة الذكي»**، المساعد الرسمي لمنصة **(نواة | NAWAH)** الوطنية لتحويل نوى التمر ومخلفات النخيل إلى قيمة صناعية واقتصادية مستدامة.

📌 **كيف أستطيع إفادتك؟**
1. إرشادك في **تسجيل دفعات النوى** وإصدار أكواد التتبع.
2. شرح **المسارات الصناعية** (الفحم المنشط، الزيوت، بديل القهوة، والأعلاف).
3. استعراض **الخريطة الذكية** ومصانع التمور ومراكز التجميع.
4. إيضاح آلية عمل **الفاحص البصري الذكي** وحساب **الأثر البيئي وخفض الكربون**.

اسألني عن أي موضوع أو خطوة في المنصة وسأجيبك فوراً! 🚀`;
  }

  // 10. Default smart comprehensive guidance
  return `أهلاً بك! بخصوص استفسارك حول: **"${userMessage}"**:

في منظومة (نواة | NAWAH)، نوفر أدوات متكاملة لإدارة هذا الجانب:
• إذا كان استفسارك يتعلق **بالعمليات والتتبع:** يمكنك تسجيل ومتابعة الدفعات عبر قسم \`/pit-management/batches\`.
• إذا كان استفسارك عن **الصناعات والتحويل:** تصفح قسم مسارات الاستفادة واستكشف الفحم المنشط، الزيوت، أو بدائل القهوة عبر \`/pit-management/pathways\`.
• إذا أردت فحص دفعة بالذكاء الاصطناعي: استخدم الفاحص البصري من قسم \`/pit-management/scanner\`.
• للتعرف على المصادر ومصانع التمور: استعرض الخريطة الذكية عبر \`/map\`.

هل ترغب في تفصيل إضافي حول مسار معين أو ميزة محددة بالمنصة؟`;
}
