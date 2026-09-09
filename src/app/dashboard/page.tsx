"use client";

import { PieChart, LayoutDashboard, AlertTriangle, TrendingDown, Clock, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const products = [
    { id: 1, name: "طماطم محمي", status: "جيد", life: "5 أيام", priority: "متوسطة", risk: "low" },
    { id: 2, name: "فراولة", status: "يحتاج انتباه", life: "يومان", priority: "عالية", risk: "high" },
    { id: 3, name: "خيار", status: "ممتاز", life: "8 أيام", priority: "منخفضة", risk: "low" },
    { id: 4, name: "ورقيات", status: "حرج", life: "يوم واحد", priority: "عاجلة", risk: "high" },
    { id: 5, name: "فلفل رومي", status: "جيد", life: "6 أيام", priority: "منخفضة", risk: "low" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            لوحة تحكم ثَمر
          </h1>
          <p className="text-secondary/60 mt-1">نظرة عامة على حالة المنتجات والمخزون</p>
        </div>
        <button className="bg-white border border-primary/20 text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-beige-light transition-colors">
          تصدير التقرير
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CheckCircle className="w-5 h-5" /></div>
            <p className="text-sm font-bold text-secondary/70">إجمالي المنتجات</p>
          </div>
          <p className="text-3xl font-black text-secondary">1,248</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-2 rounded-lg text-red-600"><AlertTriangle className="w-5 h-5" /></div>
            <p className="text-sm font-bold text-secondary/70">منتجات في خطر</p>
          </div>
          <p className="text-3xl font-black text-danger">42</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><TrendingDown className="w-5 h-5" /></div>
            <p className="text-sm font-bold text-secondary/70">نسبة تقليل الهدر</p>
          </div>
          <p className="text-3xl font-black text-success">38%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Clock className="w-5 h-5" /></div>
            <p className="text-sm font-bold text-secondary/70">متوسط الصلاحية</p>
          </div>
          <p className="text-3xl font-black text-secondary">5.2 <span className="text-sm font-normal">أيام</span></p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-primary/10 overflow-hidden">
        <div className="p-6 border-b border-black/5 bg-beige/30">
          <h2 className="text-xl font-bold text-secondary">حالة المنتجات المخزنة</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-black/5">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-secondary/70">المنتج</th>
                <th className="px-6 py-4 text-sm font-bold text-secondary/70">الحالة</th>
                <th className="px-6 py-4 text-sm font-bold text-secondary/70">العمر المتبقي</th>
                <th className="px-6 py-4 text-sm font-bold text-secondary/70">الأولوية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-beige-light/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-secondary">{product.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      product.risk === 'high' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-secondary/80">{product.life}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${
                      product.priority === 'عاجلة' ? 'text-danger' : 
                      product.priority === 'عالية' ? 'text-warning' : 'text-success'
                    }`}>
                      {product.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
