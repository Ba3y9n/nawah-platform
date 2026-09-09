"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Loader2, AlertCircle, CheckCircle2, ScanLine } from "lucide-react";
import Image from "next/image";

interface AnalysisResult {
  productName: string;
  freshnessScore: number;
  condition: string;
  visibleIndicators: string[];
  estimatedShelfLife: string;
  riskLevel: string;
  recommendation: string;
}

export default function ScannerPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("فشل في تحليل الصورة. يرجى المحاولة مرة أخرى.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4">فحص الذكاء الاصطناعي</h1>
        <p className="text-lg text-secondary/70">قم برفع صورة أو التقاطها عبر الكاميرا لتحليل جودة المنتج وعمره الافتراضي.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/10 flex flex-col items-center justify-center min-h-[400px]">
          {preview ? (
            <div className="w-full relative rounded-2xl overflow-hidden mb-6 aspect-square bg-gray-100 border border-gray-200">
              <Image src={preview} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-square rounded-2xl bg-beige/30 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary/60 mb-6">
              <Camera className="w-16 h-16 mb-4 opacity-50" />
              <p>لم يتم اختيار صورة</p>
            </div>
          )}

          <div className="flex gap-4 w-full">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-beige-light border border-primary/20 text-secondary hover:bg-beige py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" />
              رفع صورة
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={!image || isAnalyzing}
              className="flex-1 bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:hover:bg-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ScanLine className="w-5 h-5" />}
              {isAnalyzing ? "جاري التحليل..." : "تحليل"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/10 relative">
          {!result && !error && !isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary/40">
              <ScanLine className="w-16 h-16 mb-4 opacity-30" />
              <p>النتائج ستظهر هنا بعد التحليل</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-3xl">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-bold text-lg text-primary animate-pulse">جاري فحص المنتج بدقة عالية...</p>
            </div>
          )}

          {error && (
            <div className="bg-danger/10 text-danger p-6 rounded-2xl flex items-start gap-4">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-gray-100 pb-6">
                <div>
                  <p className="text-sm text-secondary/60 font-semibold mb-1">المنتج (Product)</p>
                  <h3 className="text-2xl font-bold text-secondary">{result.productName}</h3>
                </div>
                <div className="text-left bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                  <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">THAMAR Score</p>
                  <div className="text-3xl font-black text-primary">{result.freshnessScore}<span className="text-sm opacity-60">/100</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-beige-light p-4 rounded-xl border border-black/5">
                  <p className="text-sm text-secondary/60 mb-1">الحالة</p>
                  <p className="font-bold text-secondary text-lg">{result.condition}</p>
                </div>
                <div className="bg-beige-light p-4 rounded-xl border border-black/5">
                  <p className="text-sm text-secondary/60 mb-1">العمر المتوقع</p>
                  <p className="font-bold text-secondary text-lg">{result.estimatedShelfLife}</p>
                </div>
                <div className="bg-beige-light p-4 rounded-xl border border-black/5">
                  <p className="text-sm text-secondary/60 mb-1">مستوى الخطر</p>
                  <p className={`font-bold text-lg ${
                    result.riskLevel.toLowerCase() === 'low' ? 'text-success' : 
                    result.riskLevel.toLowerCase() === 'high' ? 'text-danger' : 'text-warning'
                  }`}>
                    {result.riskLevel}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-secondary mb-3">المؤشرات المرئية:</p>
                <ul className="space-y-2">
                  {result.visibleIndicators.map((indicator, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-secondary/80">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl">
                <p className="text-sm font-bold text-primary mb-2">توصية النظام:</p>
                <p className="text-secondary/90 leading-relaxed font-medium">{result.recommendation}</p>
              </div>
              
              <p className="text-xs text-center text-secondary/40 mt-4">
                * هذه النتيجة مبنية على تحليل الذكاء الاصطناعي ولا تغني عن الفحص المخبري لسلامة الغذاء.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
