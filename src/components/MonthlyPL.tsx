'use client';

import { useStore } from '@/store/useStore';

function fmt(n: number) {
  return n.toLocaleString('en-US');
}

export default function MonthlyPL() {
  const { derived, capacityPercent, jobsPerMonth, pricePerJob, cogsPercent, staffCost, rent, paintCost, utilities, misc, software } = useStore();
  const effectiveJobs = Math.round(jobsPerMonth * (capacityPercent / 100));

  const rows = [
    { label: `รายรับรวม (${fmt(effectiveJobs)} × ${fmt(pricePerJob)})`, value: derived.revenue, bold: true, type: 'revenue' as const },
    { label: `  — ค่าอะไหล่ (${cogsPercent}% COGS)`, value: -derived.cogs, bold: false, type: 'cost' as const },
    { label: '  — ค่าแรงพนักงาน 14 คน (Max)', value: -staffCost, bold: false, type: 'cost' as const },
    { label: '  — ค่าสี', value: -paintCost, bold: false, type: 'cost' as const },
    { label: '  — ไฟฟ้า + ตู้อบ', value: -utilities, bold: false, type: 'cost' as const },
    { label: '  — วัสดุสิ้นเปลือง', value: -misc, bold: false, type: 'cost' as const },
    { label: '  — ค่าเช่าที่ดิน', value: -rent, bold: false, type: 'cost' as const },
    { label: '  — ค่า Software', value: -software, bold: false, type: 'cost' as const },
    { label: 'รวมต้นทุน', value: -derived.totalCost, bold: true, type: 'cost' as const },
    { label: 'กำไรสุทธิ', value: derived.netProfitMonthly, bold: true, type: derived.netProfitMonthly >= 0 ? 'profit' as const : 'loss' as const },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-1">รายรับ / ค่าใช้จ่าย ต่อเดือน</h2>
      <p className="text-sm text-gray-400 mb-5">
        Full Capacity {fmt(effectiveJobs)} Jobs ({capacityPercent}%)
      </p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">รายการ</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">บาท/เดือน</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isNetProfit = r.label === 'กำไรสุทธิ';
              const isTotalCost = r.label === 'รวมต้นทุน';
              return (
                <tr
                  key={i}
                  className={`border-b border-gray-50 ${isNetProfit ? 'bg-gradient-to-r from-gray-50 to-white' : ''} ${isTotalCost || isNetProfit ? 'border-t-2 border-t-gray-200' : ''}`}
                >
                  <td className={`px-6 py-3 text-sm ${r.bold ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                    {r.label}
                  </td>
                  <td className={`px-6 py-3 text-sm text-right font-mono ${r.bold ? 'font-semibold' : ''} ${
                    r.type === 'revenue' ? 'text-teal-600' :
                    r.type === 'profit' ? 'text-emerald-600' :
                    r.type === 'loss' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {r.value < 0 ? fmt(Math.abs(r.value)) : fmt(r.value)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
