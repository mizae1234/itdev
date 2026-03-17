'use client';

import { useStore } from '@/store/useStore';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toLocaleString('en-US');
}

function fmtFull(n: number) {
  return n.toLocaleString('en-US');
}

const ArrowUp = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
);

const ArrowDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
);

export default function InvestmentSummary() {
  const { derived, constructionCost, equipmentCost } = useStore();

  const cards = [
    {
      label: 'เงินลงทุนเริ่มต้น',
      value: `฿${fmt(derived.initialInvestment)}`,
      sub: `ค่าก่อสร้าง ${fmtFull(constructionCost)} + อุปกรณ์ ${fmtFull(equipmentCost)}`,
      color: 'from-slate-500 to-slate-600',
      textColor: 'text-slate-600',
      icon: '💰',
    },
    {
      label: 'รายได้ต่อเดือน',
      value: `฿${fmt(derived.revenue)}`,
      sub: fmtFull(derived.revenue) + ' บาท',
      color: 'from-teal-500 to-cyan-500',
      textColor: 'text-teal-600',
      icon: '📊',
    },
    {
      label: 'กำไรสุทธิต่อเดือน',
      value: `฿${fmt(derived.netProfitMonthly)}`,
      sub: fmtFull(derived.netProfitMonthly) + ' บาท',
      color: derived.netProfitMonthly >= 0 ? 'from-emerald-500 to-green-500' : 'from-red-500 to-rose-500',
      textColor: derived.netProfitMonthly >= 0 ? 'text-emerald-600' : 'text-red-600',
      icon: derived.netProfitMonthly >= 0 ? '📈' : '📉',
    },
    {
      label: 'ผลตอบแทน (ต่อปี)',
      value: `~${derived.roiPercent.toFixed(0)}%`,
      sub: 'ROI p.a.',
      color: derived.roiPercent >= 0 ? 'from-blue-500 to-indigo-500' : 'from-red-500 to-rose-500',
      textColor: derived.roiPercent >= 0 ? 'text-blue-600' : 'text-red-600',
      icon: derived.roiPercent >= 0 ? '🚀' : '⚠️',
    },
    {
      label: 'ระยะคืนทุน',
      value: derived.paybackMonths === Infinity ? '—' : `~${derived.paybackMonths} เดือน`,
      sub: derived.paybackMonths === Infinity ? 'ยังไม่คุ้มทุน' : `~${(derived.paybackMonths / 12).toFixed(1)} ปี`,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
      icon: '⏱️',
    },
    {
      label: 'กำไรสุทธิต่อปี',
      value: `฿${fmt(derived.netProfitYearly)}`,
      sub: fmtFull(derived.netProfitYearly) + ' บาท',
      color: derived.netProfitYearly >= 0 ? 'from-emerald-500 to-teal-500' : 'from-red-500 to-rose-500',
      textColor: derived.netProfitYearly >= 0 ? 'text-emerald-600' : 'text-red-600',
      icon: derived.netProfitYearly >= 0 ? '✨' : '📉',
    },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-1">ผลตอบแทนการลงทุน (Max Wage)</h2>
      <p className="text-sm text-gray-400 mb-5">ตัวชี้วัดทางการเงินที่สำคัญ</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 group">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{c.icon}</span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center opacity-80`}>
                {c.label.includes('กำไร') || c.label.includes('ผลตอบแทน') ? (
                  derived.netProfitMonthly >= 0 ? <ArrowUp /> : <ArrowDown />
                ) : (
                  <span className="text-white text-xs font-bold">฿</span>
                )}
              </div>
            </div>
            <p className="text-xs font-medium text-gray-400 mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.textColor} mb-1`}>{c.value}</p>
            <p className="text-[11px] text-gray-400">{c.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
