'use client';

import { useStore } from '@/store/useStore';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';
import { useMemo } from 'react';

function fmtShort(n: number) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function fmtFull(n: number) {
  return n.toLocaleString('en-US');
}

interface MonthData {
  month: number;
  label: string;
  phase: number;
  phaseName: string;
  cashFlow: number;
  cumulative: number;
  capacity: number | null;
}

export default function CashFlowChart() {
  const { constructionCost, equipmentCost, jobsPerMonth, pricePerJob, cogsPercent, staffCost, rent, paintCost, utilities, misc, software } = useStore();

  const totalFixed = staffCost + rent + paintCost + utilities + misc + software;
  const constructionMonthly = constructionCost / 5;

  const { months, peakDebt, peakDebtIdx, firstProfitIdx, fullCapacityIdx, paybackIdx } = useMemo(() => {
    const data: MonthData[] = [];
    let cum = 0;

    // Phase 1: Construction (months 1-5)
    for (let i = 1; i <= 5; i++) {
      cum -= constructionMonthly;
      data.push({ month: i, label: `${i}`, phase: 1, phaseName: 'ก่อสร้าง', cashFlow: -constructionMonthly, cumulative: cum, capacity: null });
    }

    // Phase 2: Equipment (month 6)
    cum -= equipmentCost;
    data.push({ month: 6, label: '6', phase: 2, phaseName: 'ติดตั้งอุปกรณ์', cashFlow: -equipmentCost, cumulative: cum, capacity: null });

    // Phase 3: Ramp-up (months 7-10)
    const rampPcts = [25, 50, 75, 100];
    for (let i = 0; i < rampPcts.length; i++) {
      const capPct = rampPcts[i];
      const effJobs = Math.round(jobsPerMonth * (capPct / 100));
      const rev = effJobs * pricePerJob;
      const cogs = rev * (cogsPercent / 100);
      const profit = rev - cogs - totalFixed;
      cum += profit;
      data.push({ month: 7 + i, label: `${7 + i}`, phase: 3, phaseName: 'Ramp-up', cashFlow: profit, cumulative: cum, capacity: capPct });
    }

    // Phase 4: Full capacity (months 11+ until payback or max 48)
    const fullRev = jobsPerMonth * pricePerJob;
    const fullCogs = fullRev * (cogsPercent / 100);
    const fullProfit = fullRev - fullCogs - totalFixed;

    const maxMonth = fullProfit > 0 ? Math.min(Math.ceil(Math.abs(cum) / fullProfit) + 14, 48) : 20;

    for (let m = 11; m <= maxMonth; m++) {
      cum += fullProfit;
      data.push({ month: m, label: `${m}`, phase: 4, phaseName: 'เต็มกำลัง', cashFlow: fullProfit, cumulative: cum, capacity: 100 });
      if (cum >= 0 && fullProfit > 0) {
        // Add a couple more months after payback for visual
        for (let extra = 1; extra <= 2; extra++) {
          cum += fullProfit;
          data.push({ month: m + extra, label: `${m + extra}`, phase: 4, phaseName: 'เต็มกำลัง', cashFlow: fullProfit, cumulative: cum, capacity: 100 });
        }
        break;
      }
    }

    // Find milestones
    let pd = 0, pdi = 0, fpi = -1, fci = -1, pbi = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i].cumulative < pd) { pd = data[i].cumulative; pdi = i; }
      if (fpi === -1 && data[i].cashFlow > 0) fpi = i;
      if (fci === -1 && data[i].phase === 4) fci = i;
      if (pbi === -1 && i > 0 && data[i].cumulative >= 0 && data[i - 1].cumulative < 0) pbi = i;
    }

    return { months: data, peakDebt: pd, peakDebtIdx: pdi, firstProfitIdx: fpi, fullCapacityIdx: fci, paybackIdx: pbi };
  }, [constructionCost, equipmentCost, constructionMonthly, jobsPerMonth, pricePerJob, cogsPercent, totalFixed]);

  const fullProfit = jobsPerMonth * pricePerJob - jobsPerMonth * pricePerJob * (cogsPercent / 100) - totalFixed;

  // Phase widths for the highway bar
  const totalMonths = months.length;
  const p1w = (5 / totalMonths) * 100;
  const p2w = (1 / totalMonths) * 100;
  const p3w = (4 / totalMonths) * 100;
  const p4w = 100 - p1w - p2w - p3w;

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-1">เส้นทางสู่จุดคุ้มทุน</h2>
      <p className="text-sm text-gray-400 mb-6">Execution Highway & Cumulative J-Curve</p>

      {/* Execution Highway Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Execution Highway</p>
        <div className="flex rounded-full overflow-hidden h-10 mb-3 shadow-inner">
          <div style={{ width: `${p1w}%` }} className="bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center relative group">
            <span className="text-white font-bold text-sm drop-shadow">1</span>
          </div>
          <div style={{ width: `${p2w}%` }} className="bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow">2</span>
          </div>
          <div style={{ width: `${p3w}%` }} className="bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow">3</span>
          </div>
          <div style={{ width: `${p4w}%` }} className="bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow">4</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-xs font-semibold text-teal-700">เดือน 1–5: Phase 1</p>
            <p className="text-[10px] text-gray-400">ก่อสร้าง ({fmtShort(constructionCost)})</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-teal-700">เดือน 6: Phase 2</p>
            <p className="text-[10px] text-gray-400">ติดตั้งอุปกรณ์ ({fmtShort(equipmentCost)})</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-cyan-700">เดือน 7–10: Phase 3</p>
            <p className="text-[10px] text-gray-400">เริ่มดำเนินการ (Ramp-up)</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-700">เดือน 11+: Phase 4</p>
            <p className="text-[10px] text-gray-400">เต็มกำลังผลิต ({fmtFull(jobsPerMonth)} Jobs/เดือน)</p>
          </div>
        </div>
      </div>

      {/* J-Curve Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Cumulative J-Curve</h3>

        {/* Milestone Annotations */}
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Peak Debt */}
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <span className="text-red-500 text-lg">↓</span>
            <div>
              <p className="text-[10px] text-red-400 font-semibold">Peak Investment สะสมสูงสุด</p>
              <p className="text-sm font-bold text-red-600 font-mono">{fmtFull(peakDebt)} บาท</p>
              <p className="text-[10px] text-red-400">ที่เดือน {months[peakDebtIdx]?.month}</p>
            </div>
          </div>

          {/* First Profit */}
          {firstProfitIdx >= 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <span className="text-emerald-500 text-lg">↗</span>
              <div>
                <p className="text-[10px] text-emerald-400 font-semibold">เริ่มทำกำไร</p>
                <p className="text-sm font-bold text-emerald-600 font-mono">+{fmtFull(months[firstProfitIdx]?.cashFlow)} บาท/เดือน</p>
                <p className="text-[10px] text-emerald-400">เดือนที่ {months[firstProfitIdx]?.month}</p>
              </div>
            </div>
          )}

          {/* Full Capacity */}
          {fullCapacityIdx >= 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <span className="text-amber-500 text-lg">🚀</span>
              <div>
                <p className="text-[10px] text-amber-500 font-semibold">กำไรเต็มกำลัง</p>
                <p className="text-sm font-bold text-amber-600 font-mono">+{fmtFull(fullProfit)} บาท/เดือน</p>
                <p className="text-[10px] text-amber-400">เดือนที่ {months[fullCapacityIdx]?.month}+</p>
              </div>
            </div>
          )}

          {/* Payback */}
          {paybackIdx >= 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
              <span className="text-blue-500 text-lg">🎯</span>
              <div>
                <p className="text-[10px] text-blue-400 font-semibold">จุดคืนทุนสะสม 100%</p>
                <p className="text-sm font-bold text-blue-600 font-mono">Payback Point</p>
                <p className="text-[10px] text-blue-400">เดือนที่ ~{months[paybackIdx]?.month}</p>
              </div>
            </div>
          )}
        </div>

        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={months} margin={{ top: 10, right: 30, bottom: 10, left: 20 }}>
            <defs>
              <linearGradient id="jCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="40%" stopColor="#14b8a6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="jCurveStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="60%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              label={{ value: 'Month', position: 'insideBottomRight', offset: -5, style: { fontSize: 11, fill: '#9ca3af' } }}
            />
            <YAxis
              tickFormatter={(v: number) => `฿${fmtShort(v)}`}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
            />
            <Tooltip
              formatter={(value: unknown) => [`฿${fmtFull(Number(value))}`, 'สะสม']}
              labelFormatter={(label) => `เดือนที่ ${label}`}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} strokeDasharray="8 4" strokeOpacity={0.6} label={{ value: 'Zero Line', position: 'right', style: { fontSize: 10, fill: '#ef4444' } }} />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="url(#jCurveStroke)"
              strokeWidth={3}
              fill="url(#jCurveGrad)"
              dot={(props: Record<string, unknown>) => {
                const cx = Number(props.cx ?? 0);
                const cy = Number(props.cy ?? 0);
                const index = Number(props.index ?? 0);
                const isMilestone = index === peakDebtIdx || index === firstProfitIdx || index === paybackIdx || index === fullCapacityIdx;
                if (!isMilestone) return <circle key={index} cx={cx} cy={cy} r={0} />;
                const color = index === peakDebtIdx ? '#ef4444' : index === paybackIdx ? '#3b82f6' : index === firstProfitIdx ? '#10b981' : '#f59e0b';
                return (
                  <g key={index}>
                    <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} />
                    <circle cx={cx} cy={cy} r={4} fill={color} />
                  </g>
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Detail table */}
      <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">เดือน</th>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">กำลังผลิต</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wider">Cash Flow/เดือน</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wider">สะสม</th>
            </tr>
          </thead>
          <tbody>
            {months.map((d, i) => {
              const isMilestone = i === peakDebtIdx || i === firstProfitIdx || i === paybackIdx;
              return (
                <tr key={i} className={`border-b border-gray-50 ${i === peakDebtIdx ? 'bg-red-50' : i === paybackIdx ? 'bg-blue-50' : i === firstProfitIdx ? 'bg-emerald-50' : ''}`}>
                  <td className="px-4 py-2 font-medium text-gray-700">
                    {d.label}
                    {isMilestone && <span className="ml-1 text-[10px]">{i === peakDebtIdx ? '📍' : i === paybackIdx ? '🎯' : '↗️'}</span>}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{d.capacity !== null ? `${d.capacity}%` : d.phaseName}</td>
                  <td className={`px-4 py-2 text-right font-mono ${d.cashFlow >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {d.cashFlow >= 0 ? `+${fmtFull(d.cashFlow)}` : fmtFull(d.cashFlow)}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono font-medium ${d.cumulative >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {fmtFull(Math.round(d.cumulative))}
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
