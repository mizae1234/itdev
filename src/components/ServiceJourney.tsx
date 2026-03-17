'use client';

const steps = [
  {
    num: 1,
    title: 'ต้อนรับ',
    subtitle: 'Welcome',
    icon: '👋',
  },
  {
    num: 2,
    title: 'ประเมิน & เปิดใบซ่อม',
    subtitle: 'Estimate',
    icon: '📋',
  },
  {
    num: 3,
    title: 'ขออนุมัติประกันภัย',
    subtitle: 'Insurance',
    icon: '🛡️',
  },
  {
    num: 4,
    title: 'สั่งอะไหล่ & วางแผน',
    subtitle: 'Parts & Plan',
    icon: '🔧',
  },
  {
    num: 5,
    title: 'ดำเนินการซ่อม',
    subtitle: 'Repair',
    icon: '🔨',
  },
  {
    num: 6,
    title: 'ตรวจสอบคุณภาพ',
    subtitle: 'QC',
    icon: '✅',
  },
  {
    num: 7,
    title: 'ส่งมอบ & วางบิล',
    subtitle: 'Delivery',
    icon: '🚗',
  },
];

const digitalTouchpoints = [
  {
    label: 'ระบบ EMCS',
    desc: 'ประกันทั้ง OIC / Non-OIC / เงินสด',
    position: 'after-2', // appears between step 2-3
  },
  {
    label: 'Photo Doc',
    desc: 'Before / During / After',
    position: 'after-4', // appears between step 4-5
  },
  {
    label: 'After-Service',
    desc: 'CSI Score & Warranty',
    position: 'after-7', // appears after step 7
  },
];

export default function ServiceJourney() {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-1">เส้นทางบริการและการเชื่อมต่อดิจิทัลเต็มรูปแบบ</h2>
      <p className="text-sm text-gray-400 mb-6">Service Journey & Full Digital Integration</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 overflow-hidden">
        {/* Digital Touchpoints Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-full px-5 py-2">
            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span className="text-sm font-semibold text-teal-700">จุดเชื่อมต่อดิจิทัลเต็มรูปแบบ</span>
          </div>
        </div>

        {/* Digital Touchpoint Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {digitalTouchpoints.map((tp) => (
            <div key={tp.label} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 text-center border border-slate-700">
              <p className="text-sm font-bold text-white mb-1">{tp.label}</p>
              <p className="text-[11px] text-gray-400">{tp.desc}</p>
            </div>
          ))}
        </div>

        {/* Service Journey Pipeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-8 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-teal-500 to-amber-400 rounded-full z-0 hidden md:block" />

          {/* Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center group">
                {/* Circle */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-200/50 mb-3 group-hover:scale-110 transition-transform border-4 border-white">
                  <span className="text-white font-bold text-lg">{step.num}</span>
                </div>
                {/* Icon */}
                <span className="text-xl mb-1">{step.icon}</span>
                {/* Label */}
                <p className="text-xs font-semibold text-gray-700 leading-tight">{step.title}</p>
                <p className="text-[10px] text-gray-400">({step.subtitle})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Integration markers */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl p-3">
            <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-teal-700">ระบบ EMCS</p>
              <p className="text-[10px] text-teal-500">เชื่อมต่อที่ขั้นตอน 2-3 • ประกันทั้ง OIC / Non-OIC / เงินสด</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-cyan-50 border border-cyan-200 rounded-xl p-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-cyan-700">Photo Doc</p>
              <p className="text-[10px] text-cyan-500">เชื่อมต่อที่ขั้นตอน 4-5 • Before / During / After</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-700">After-Service</p>
              <p className="text-[10px] text-amber-500">หลังส่งมอบ • CSI Score & Warranty</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
