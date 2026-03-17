'use client';

import { useStore } from '@/store/useStore';

function fmtFull(n: number) {
  return n.toLocaleString('en-US');
}

function fmtShort(n: number) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

export default function ProjectSummary() {
  const { constructionCost, equipmentCost, derived, jobsPerMonth, pricePerJob, cogsPercent } = useStore();

  const highlights = [
    {
      icon: '🏗️',
      title: 'ศูนย์ซ่อมสีมาตรฐานโรงงาน',
      desc: 'ออกแบบตามมาตรฐาน AION ด้วยอุปกรณ์และเทคโนโลยีระดับโรงงาน พร้อมตู้อบสีอินฟราเรดและระบบผสมสีคอมพิวเตอร์',
    },
    {
      icon: '⚡',
      title: 'ผู้เชี่ยวชาญรถยนต์ EV',
      desc: 'รองรับการซ่อมตัวถังรถยนต์ไฟฟ้าโดยเฉพาะ ด้วยมาตรฐานความปลอดภัยสำหรับระบบแบตเตอรี่แรงดันสูง',
    },
    {
      icon: '🤝',
      title: 'ตัวแทน AION อย่างเป็นทางการ',
      desc: 'ได้รับแต่งตั้งเป็น Authorized Body & Paint Center จาก AION ประเทศไทย การันตีคุณภาพและความน่าเชื่อถือ',
    },
    {
      icon: '📱',
      title: 'ดิจิทัลเต็มรูปแบบ',
      desc: 'ระบบ EMCS, Photo Doc, After-Service ครบวงจร เชื่อมต่อลูกค้าตั้งแต่รับรถจนถึงส่งมอบและหลังบริการ',
    },
  ];

  return (
    <section className="relative">
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-8 md:p-12">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-amber-300 text-sm">✨</span>
              <span className="text-xs font-medium text-amber-300">Investment Opportunity</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              บทสรุปโครงการลงทุน
            </h2>
            <p className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              The AION Opportunity
            </p>
          </div>

          {/* Key Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {highlights.map((h) => (
              <div key={h.title} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <span className="text-2xl mb-3 block">{h.icon}</span>
                <h3 className="text-sm font-bold text-white mb-2">{h.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>

          {/* Financial Summary Box */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-sm font-semibold text-teal-300 uppercase tracking-wider mb-5">สรุปตัวเลขสำคัญ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">฿{fmtShort(derived.initialInvestment)}</p>
                <p className="text-xs text-gray-400">เงินลงทุนรวม</p>
                <p className="text-[10px] text-gray-500 mt-1">ก่อสร้าง {fmtShort(constructionCost)} + อุปกรณ์ {fmtShort(equipmentCost)}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">฿{fmtShort(derived.netProfitMonthly)}</p>
                <p className="text-xs text-gray-400">กำไรสุทธิ/เดือน</p>
                <p className="text-[10px] text-gray-500 mt-1">ที่กำลังการผลิตเต็ม</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">~{derived.roiPercent.toFixed(0)}%</p>
                <p className="text-xs text-gray-400">ROI ต่อปี</p>
                <p className="text-[10px] text-gray-500 mt-1">ผลตอบแทนการลงทุน</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">~{derived.paybackMonths === Infinity ? '—' : (derived.paybackMonths / 12).toFixed(1)}</p>
                <p className="text-xs text-gray-400">ปี คืนทุน</p>
                <p className="text-[10px] text-gray-500 mt-1">~{derived.paybackMonths === Infinity ? '—' : derived.paybackMonths} เดือน</p>
              </div>
            </div>
          </div>

          {/* Why Invest */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-teal-300 uppercase tracking-wider mb-4">ทำไมต้องลงทุนตอนนี้</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: '📈', title: 'ตลาด EV เติบโตสูง', desc: 'ยอดขายรถ EV ในไทยเพิ่มขึ้นกว่า 300% ศูนย์ซ่อมเฉพาะทางยังมีน้อย' },
                { icon: '🏆', title: 'First Mover Advantage', desc: 'เป็นผู้บุกเบิกศูนย์ซ่อมสี EV ที่ได้รับการรับรองจาก AION ก่อนคู่แข่ง' },
                { icon: '💎', title: 'รายได้มั่นคง', desc: 'ฐานลูกค้าจากประกันภัย OIC/Non-OIC และเจ้าของรถโดยตรง หลากหลายช่องทาง' },
              ].map((item) => (
                <div key={item.title} className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-400/20 rounded-xl p-4">
                  <span className="text-xl mb-2 block">{item.icon}</span>
                  <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400/30 rounded-2xl px-8 py-6">
              <p className="text-lg font-bold text-white">พร้อมร่วมลงทุนกับ AION Body & Paint Center</p>
              <p className="text-sm text-amber-200">โอกาสทองในตลาด EV ที่เติบโตอย่างรวดเร็ว</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-300 font-medium">เปิดรับนักลงทุน — Q2 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
