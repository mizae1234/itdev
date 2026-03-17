'use client';

export default function StaffStructure() {
  const frontOfHouse = [
    {
      role: 'Manager',
      count: 1,
      desc: 'ควบคุมคุณภาพรวม',
      salary: '80,000 บาท',
    },
    {
      role: 'SA / Service Advisor',
      count: 2,
      desc: 'รับรถ, ประเมินราคา, สั่งอะไหล่, อัปเดต, QC, ส่งมอบ',
      salary: '30,000 บาท',
    },
    {
      role: 'Admin',
      count: 1,
      desc: 'บันทึก EMCS, Photo Doc, วางบิล, คุมสต๊อก',
      salary: '30,000 บาท',
    },
  ];

  const backOfHouse = [
    { role: 'ช่างเคาะ', count: 2, salary: '50k–70k บาท' },
    { role: 'ช่างเตรียมพื้น', count: 2, salary: '36k–50k บาท' },
    { role: 'ช่างประกอบ', count: 2, salary: '36k–50k บาท' },
    { role: 'ช่างขัดสี', count: 2, salary: '30k–50k บาท' },
    { role: 'ช่างผสมสี', count: 1, salary: '25k–35k บาท' },
    { role: 'ช่างพ่นสี', count: 1, salary: '20k–35k บาท' },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-1">โครงสร้างบุคลากร 14 ตำแหน่ง</h2>
      <p className="text-sm text-gray-400 mb-6">การผสานงานบริการและงานช่างเฉพาะทาง</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Front-of-House */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">ศูนย์บัญชาการส่วนหน้า</p>
              <p className="text-[10px] text-teal-100">(Front-of-House)</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {frontOfHouse.map((staff) => (
              <div key={staff.role} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{staff.role} <span className="text-gray-400 font-normal">({staff.count} คน)</span></p>
                    <p className="text-xs text-gray-500 mt-0.5">{staff.desc}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-teal-600 mt-2">{staff.salary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back-of-House */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">โครงสร้างทีมช่าง</p>
              <p className="text-[10px] text-gray-300">(Back-of-House)</p>
            </div>
          </div>

          {/* Gatekeeper roles */}
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">Gatekeeper</p>
                <p className="text-xs font-bold text-amber-700">Foreman</p>
                <p className="text-[10px] text-amber-500">(วางแผน/จ่ายงาน)</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">Gatekeeper</p>
                <p className="text-xs font-bold text-amber-700">QC</p>
                <p className="text-[10px] text-amber-500">(ตรวจทุกขั้นตอน)</p>
              </div>
            </div>
          </div>

          {/* Technicians Grid */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {backOfHouse.map((staff) => (
                <div key={staff.role} className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                  <p className="text-sm font-bold text-gray-800">{staff.role}</p>
                  <p className="text-[10px] text-gray-400">({staff.count} คน)</p>
                  <p className="text-xs font-semibold text-teal-600 mt-1">{staff.salary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="mt-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 text-center shadow-sm">
        <p className="text-sm font-bold text-white">
          รวมบุคลากร 14 คน <span className="mx-2 opacity-60">|</span> โครงสร้างต้นทุนค่าแรงรวม: 337,000 – 430,000 บาท / เดือน
        </p>
      </div>
    </section>
  );
}
