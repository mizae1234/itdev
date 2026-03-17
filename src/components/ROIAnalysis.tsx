'use client';

import { useStore } from '@/store/useStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function fmtFull(n: number) {
  return n.toLocaleString('en-US');
}

export default function ROIAnalysis() {
  const { derived } = useStore();

  const chartData = [
    { name: 'รายได้', value: derived.revenue, fill: '#14b8a6' },
    { name: 'ต้นทุนรวม', value: derived.totalCost, fill: '#f59e0b' },
    { name: 'กำไรสุทธิ', value: derived.netProfitMonthly, fill: derived.netProfitMonthly >= 0 ? '#10b981' : '#ef4444' },
  ];

  const metrics = [
    { label: 'ผลตอบแทนต่อปี', value: `${derived.roiPercent.toFixed(1)}%`, positive: derived.roiPercent >= 0 },
    { label: 'อัตรากำไรสุทธิ/เดือน', value: `${derived.revenue > 0 ? ((derived.netProfitMonthly / derived.revenue) * 100).toFixed(1) : 0}%`, positive: derived.netProfitMonthly >= 0 },
    { label: 'ระยะคืนทุน', value: derived.paybackMonths === Infinity ? 'ไม่คุ้มทุน' : `${derived.paybackMonths} เดือน`, positive: derived.paybackMonths !== Infinity && derived.paybackMonths <= 24 },
    { label: 'สัดส่วนต้นทุน/รายได้', value: `${derived.revenue > 0 ? ((derived.totalCost / derived.revenue) * 100).toFixed(1) : 0}%`, positive: derived.revenue > 0 && derived.totalCost / derived.revenue < 1 },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-1">วิเคราะห์ผลตอบแทน (ROI)</h2>
      <p className="text-sm text-gray-400 mb-5">ตัวชี้วัดผลตอบแทนและสัดส่วนรายได้-ต้นทุน</p>

      {/* Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 mb-1">{m.label}</p>
            <p className={`text-lg font-bold ${m.positive ? 'text-emerald-600' : 'text-red-500'}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">รายได้ vs ต้นทุน vs กำไร (รายเดือน)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis tickFormatter={(v: number) => `฿${fmt(v)}`} tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip
              formatter={(value: unknown) => [`฿${fmtFull(Number(value))}`, '']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={80}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
