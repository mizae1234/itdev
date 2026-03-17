'use client';

import { useStore } from '@/store/useStore';

function fmtFull(n: number) {
  return n.toLocaleString('en-US');
}

export default function HeroSection() {
  const { constructionCost, equipmentCost, derived, jobsPerMonth, capacityPercent } = useStore();
  const effectiveJobs = Math.round(jobsPerMonth * (capacityPercent / 100));

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-8 md:p-12">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      
      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-1.5 mb-6">
          <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-xs font-medium text-teal-300">ผู้เชี่ยวชาญ EV & ตัวแทน AION อย่างเป็นทางการ</span>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          AION Body & Paint Center
        </h1>
        <p className="text-lg md:text-xl text-teal-200/80 mb-2">
          โครงการศูนย์ซ่อมสีและตัวถังรถยนต์ AION
        </p>
        <p className="text-sm text-gray-400 max-w-xl mb-8">
          ข้อเสนอโครงการ 2026 — ศูนย์บริการซ่อมสีและตัวถังรถยนต์ EV ระดับพรีเมียม
          ด้วยเทคโนโลยีล้ำสมัย ได้รับการแต่งตั้งเป็นตัวแทนอย่างเป็นทางการจาก AION
        </p>
        
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'เงินลงทุนเริ่มต้น', value: `฿${fmtFull(derived.initialInvestment)}` },
            { label: 'ค่าก่อสร้าง', value: `฿${fmtFull(constructionCost)}` },
            { label: 'ค่าอุปกรณ์', value: `฿${fmtFull(equipmentCost)}` },
            { label: 'กำลังการผลิต/เดือน', value: `${fmtFull(effectiveJobs)} งาน (${capacityPercent}%)` },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-lg font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
