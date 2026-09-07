# THAMAR AI | ثَمر AI 🌴🤖

> **نحفظ الغذاء، ونحوّل المخلفات إلى قيمة**
> 
> ثَمر AI يحوّل مخلفات النخيل إلى غلاف حيوي ذكي مدعوم بالذكاء الاصطناعي لتقليل هدر الخضار والفواكه.

---

## 📖 Project Overview
THAMAR AI is a smart sustainable platform aiming to reduce fruit and vegetable waste by transforming palm waste fibers into biodegradable bio-wrap, supported by Artificial Intelligence (Gemini Vision API). 

This project is built as an interactive, production-ready MVP for the University Innovation Challenge 2026.

## ✨ Features
1. **Sustainable Bio-Packaging**: Concept and integration of palm waste bio-wrap.
2. **AI Product Scanner**: Live integration with **Google Gemini Vision API** to analyze product freshness from images.
3. **Freshness Evaluation & Shelf-life Prediction**: Data-driven dashboards to predict remaining shelf life.
4. **Smart Recommendations (Insights)**: AI-generated actionable insights for farmers and distributors to prioritize products and minimize waste.

## 🚀 Technologies Used
- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS (Arabic-first, RTL support)
- **AI Integration**: Google Gemini API (`@google/generative-ai`)
- **Icons & Charts**: Lucide React, Recharts
- **Animations**: Framer Motion (Ready)

## 📁 Folder Structure
\`\`\`text
src/
├── app/
│   ├── api/
│   │   └── analyze/     # Gemini API integration route
│   ├── bio-wrap/        # Innovation details page
│   ├── dashboard/       # Farm/Store stats dashboard
│   ├── insights/        # Smart AI recommendations
│   ├── prediction/      # Shelf-life prediction tool
│   ├── scanner/         # Interactive AI Vision scanner
│   ├── globals.css      # Tailwind & Custom Variables
│   ├── layout.tsx       # Root layout & RTL config
│   └── page.tsx         # Landing Page
├── components/          # Reusable UI components (Navbar)
└── lib/                 # Utilities and helpers
\`\`\`

## 🛠️ Installation & Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/your-username/thamar-ai.git
   cd thamar-ai
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup:**
   Copy the example environment file and add your Gemini API key:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Open `.env` and insert your API key:
   \`\`\`env
   GEMINI_API_KEY=your_gemini_api_key_here
   \`\`\`

4. **Run the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment
This project is optimized for deployment on [Vercel](https://vercel.com).
1. Push the code to a GitHub repository.
2. Import the repository into Vercel.
3. Add the `GEMINI_API_KEY` to your Vercel Environment Variables.
4. Deploy!

## 💡 About
Designed specifically for the Saudi sustainability and innovation ecosystem, blending nature (palm waste) with the future (AI).
