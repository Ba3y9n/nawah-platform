import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to generative AI format
    const imageParts = [
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: image.type,
        },
      },
    ];

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert food scientist and agricultural AI developed by 'THAMAR AI | ثَمر AI' in Saudi Arabia.
      Analyze this image of a fruit or vegetable to assess its freshness and predict shelf life.
      Respond ONLY in valid JSON format with the exact keys specified below. No markdown formatting, no code blocks, just raw JSON.
      
      {
        "productName": "Name of the product in English",
        "freshnessScore": number between 0 and 100,
        "condition": "Excellent", "Good", "Fair", or "Poor",
        "visibleIndicators": ["list of 3-4 visible signs, e.g., minor bruising, vibrant color"],
        "estimatedShelfLife": "number of days (e.g., 5 Days)",
        "riskLevel": "Low", "Medium", or "High",
        "recommendation": "A short, professional recommendation for storage or consumption"
      }
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Clean potential markdown wrap if the AI ignored instructions
    let jsonString = responseText;
    if (jsonString.startsWith("\`\`\`json")) {
      jsonString = jsonString.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (jsonString.startsWith("\`\`\`")) {
      jsonString = jsonString.replace(/\`\`\`/g, "").trim();
    }

    const data = JSON.parse(jsonString);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("AI Analysis Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to analyze image", details: errorMessage },
      { status: 500 }
    );
  }
}
