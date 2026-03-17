'use client';

import { useStore } from '@/store/useStore';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

function fmtFull(n: number) {
  return n.toLocaleString('en-US');
}

export default function SensitivityAnalysis() {
  const { derived, jobsPerMonth, pricePerJob, cogsPercent, staffCost, rent, paintCost, utilities, misc, software, capacityPercent } = useStore();
  const initialInvestment = derived.initialInvestment;
  const effectiveJobs = Math.round(jobsPerMonth * (capacityPercent / 100));

  const totalFixed = staffCost + rent + paintCost + utilities + misc + software;
  const marginPerJob = pricePerJob * (1 - cogsPercent / 100);

  const data = [];
  for (let jobs = 50; jobs <= 600; jobs += 25) {
    const rev = jobs * pricePerJob;
    const cogs = rev * (cogsPercent / 100);
    const monthlyProfit = rev - cogs - totalFixed;
    const yearlyProfit = monthlyProfit * 12;
    const roi = initialInvestment > 0 ? (yearlyProfit / initialInvestment) * 100 : 0;
    const payback = monthlyProfit > 0 ? Math.ceil(initialInvestment / monthlyProfit) : null;
    data.push({
      jobs,
      roi: Math.round(roi * 10) / 10,
      monthlyProfit,
      payback,
      isCurrentJobs: jobs === effectiveJobs,
    });
  }

  if (!data.some((d) => d.jobs === effectiveJobs)) {
    const rev = effectiveJobs * pricePerJob;
    const cogs = rev * (cogsPercent / 100);
    const mp = rev - cogs - totalFixed;
    const yp = mp * 12;
    const roi = initialInvestment > 0 ? (yp / initialInvestment) * 100 : 0;
    data.push({
      jobs: effectiveJobs,
      roi: Math.round(roi * 10) / 10,
      monthlyProfit: mp,
      payback: mp > 0 ? Math.ceil(initialInvestment / mp) : null,
      isCurrentJobs: true,
    });
    data.sort((a, b) => a.jobs - b.jobs);
  }

  const breakEvenJobs = marginPerJob > 0 ? Math.ceil(totalFixed / marginPerJob) : null;

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-1">วิเคราะห์ความอ่อนไหว</h2>
      <p className="text-sm text-gray-400 mb-5">
        ผลตอบแทนเปลี่ยนแปลงอย่างไรตามจำนวนงาน
        {breakEvenJobs && (
          <span className="ml-2 text-amber-600 font-medium">• จุดคุ้มทุน: {breakEvenJobs} งาน/เดือน</span>
        )}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ROI Line Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">ROI % ตามจำนวนงานต่อเดือน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="jobs" tick={{ fontSize: 11, fill: '#9ca3af' }} label={{ value: 'งาน/เดือน', position: 'insideBottom', offset: -2, style: { fontSize: 11, fill: '#9ca3af' } }} />
              <YAxis tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                formatter={(value: unknown) => [`${value}%`, 'ROI']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
              {breakEvenJobs && (
                <ReferenceLine x={breakEvenJobs} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'จุดคุ้มทุน', position: 'top', style: { fontSize: 10, fill: '#f59e0b' } }} />
              )}
              <ReferenceLine x={effectiveJobs} stroke="#14b8a6" strokeDasharray="5 5" label={{ value: `ปัจจุบัน (${capacityPercent}%)`, position: 'top', style: { fontSize: 10, fill: '#14b8a6' } }} />
              <Line type="monotone" dataKey="roi" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sensitivity Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">งาน/เดือน</th>
                <th className="px-4 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wider">กำไร/เดือน</th>
                <th className="px-4 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wider">ROI %</th>
                <th className="px-4 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wider">คืนทุน</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className={`border-b border-gray-50 ${d.isCurrentJobs ? 'bg-teal-50 font-semibold' : ''}`}>
                  <td className="px-4 py-2 text-gray-700">
                    {d.jobs}
                    {d.isCurrentJobs && <span className="ml-1 text-teal-500 text-[10px]">◀ ปัจจุบัน</span>}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${d.monthlyProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    ฿{fmtFull(d.monthlyProfit)}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${d.roi >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                    {d.roi}%
                  </td>
                  <td className="px-4 py-2 text-right text-gray-500 font-mono">
                    {d.payback ? `${d.payback} เดือน` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
