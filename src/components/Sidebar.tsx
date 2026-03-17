'use client';

import { useState, useCallback, useEffect } from 'react';
import { useStore } from '@/store/useStore';

const fields: { label: string; field: string; min?: number; max?: number }[] = [
  { label: 'ค่าก่อสร้าง', field: 'constructionCost', min: 0 },
  { label: 'ค่าอุปกรณ์', field: 'equipmentCost', min: 0 },
  { label: 'จำนวนงาน / เดือน', field: 'jobsPerMonth', min: 0 },
  { label: 'ราคา / งาน', field: 'pricePerJob', min: 0 },
  { label: 'ค่าอะไหล่ (COGS) %', field: 'cogsPercent', min: 0, max: 100 },
  { label: 'ค่าแรงพนักงาน 14 คน (Max)', field: 'staffCost', min: 0 },
  { label: 'ค่าเช่าที่ดิน', field: 'rent', min: 0 },
  { label: 'ค่าสี', field: 'paintCost', min: 0 },
  { label: 'ไฟฟ้า + ตู้อบ', field: 'utilities', min: 0 },
  { label: 'วัสดุสิ้นเปลือง', field: 'misc', min: 0 },
  { label: 'ค่า Software', field: 'software', min: 0 },
];

const paramFields = ['constructionCost', 'equipmentCost', 'jobsPerMonth', 'pricePerJob', 'cogsPercent', 'staffCost', 'rent', 'paintCost', 'utilities', 'misc', 'software', 'capacityPercent'] as const;

function fmt(n: number) {
  return n.toLocaleString('en-US');
}

function NumberInput({ label, field, min, max }: { label: string; field: string; min?: number; max?: number }) {
  const storeVal = useStore((s) => s[field as keyof typeof s] as number);
  const setField = useStore((s) => s.setField);
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState('');

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setEditing(true);
    setRaw(String(storeVal));
    setTimeout(() => e.target.select(), 0);
  }, [storeVal]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '' || v === '-' || /^-?\d*\.?\d*$/.test(v)) {
      setRaw(v);
      const num = Number(v);
      if (!isNaN(num) && v !== '' && v !== '-') {
        const clamped = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, num));
        setField(field as never, clamped);
      }
    }
  }, [field, min, max, setField]);

  const handleBlur = useCallback(() => {
    setEditing(false);
    const num = Number(raw);
    if (isNaN(num) || raw === '' || raw === '-') {
      setField(field as never, 0);
    }
  }, [raw, field, setField]);

  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={editing ? raw : fmt(storeVal)}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400 transition-all"
      />
    </div>
  );
}

interface Scenario {
  id: string;
  name: string;
  [key: string]: unknown;
}

export default function Sidebar() {
  const store = useStore();
  const { derived, setField, capacityPercent } = store;

  const [scenarioName, setScenarioName] = useState('Default');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showList, setShowList] = useState(false);

  // Load scenarios on mount
  useEffect(() => {
    fetch('/api/scenarios').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setScenarios(data);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    const params: Record<string, unknown> = { name: scenarioName };
    if (activeId) params.id = activeId;
    for (const f of paramFields) {
      params[f] = store[f];
    }
    try {
      const res = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveId(data.id);
        setSaveMsg('✅ บันทึกแล้ว');
        // Refresh list
        const list = await fetch('/api/scenarios').then(r => r.json());
        if (Array.isArray(list)) setScenarios(list);
      } else {
        setSaveMsg('❌ ' + (data.error || 'Error'));
      }
    } catch {
      setSaveMsg('❌ ไม่สามารถเชื่อมต่อ DB');
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleLoad = (s: Scenario) => {
    setActiveId(s.id);
    setScenarioName(s.name);
    for (const f of paramFields) {
      if (f in s) setField(f as never, Number(s[f]));
    }
    setShowList(false);
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/scenarios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setScenarios(prev => prev.filter(s => s.id !== id));
    if (activeId === id) setActiveId(null);
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 bg-white border-r border-gray-100 lg:h-screen lg:overflow-y-auto lg:sticky lg:top-0 p-5 space-y-5 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h2 className="font-bold text-gray-800 text-sm">AION Body & Paint</h2>
          <p className="text-[11px] text-gray-400">แบบจำลองทางการเงิน</p>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ตัวแปรปรับค่าได้</h3>
        {fields.map((f) => (
          <NumberInput key={f.field} label={f.label} field={f.field} min={f.min} max={f.max} />
        ))}
      </div>

      {/* Capacity Slider */}
      <div className="pt-3 border-t border-gray-100 space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">อัตราการใช้กำลังการผลิต</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-teal-600">{capacityPercent}%</span>
          <span className="text-[11px] text-gray-400">{Math.round(store.jobsPerMonth * capacityPercent / 100)} งาน/เดือน</span>
        </div>
        <input
          type="range"
          min={25}
          max={300}
          step={5}
          value={capacityPercent}
          onChange={(e) => setField('capacityPercent', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>25%</span>
          <span>100%</span>
          <span>200%</span>
          <span>300%</span>
        </div>
      </div>

      {/* Break-even */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-4 border border-teal-100">
        <p className="text-[11px] text-teal-600 font-semibold uppercase tracking-wider mb-1">จุดคุ้มทุน</p>
        <p className="text-2xl font-bold text-teal-700">{derived.breakEvenJobs === Infinity ? '—' : fmt(derived.breakEvenJobs)}</p>
        <p className="text-xs text-teal-500">งานต่อเดือนที่ต้องการ</p>
      </div>

      {/* Save / Load Scenario */}
      <div className="pt-3 border-t border-gray-100 space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">💾 บันทึก Scenario</h3>
        <input
          type="text"
          placeholder="ชื่อ Scenario"
          value={scenarioName}
          onChange={(e) => setScenarioName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400/40"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-3 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 shadow-sm"
          >
            {saving ? 'กำลังบันทึก...' : activeId ? '💾 อัปเดต' : '💾 บันทึกใหม่'}
          </button>
          <button
            onClick={() => { setActiveId(null); setScenarioName(''); }}
            className="px-3 py-2.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-all"
          >
            + ใหม่
          </button>
        </div>
        {saveMsg && <p className="text-xs text-center">{saveMsg}</p>}

        {/* Load Scenarios */}
        <button
          onClick={() => setShowList(!showList)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
        >
          📂 โหลด Scenario ({scenarios.length})
        </button>
        {showList && scenarios.length > 0 && (
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {scenarios.map((s) => (
              <div key={s.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${s.id === activeId ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50 border border-gray-100'}`}>
                <button onClick={() => handleLoad(s)} className="text-left flex-1 font-medium text-gray-700 hover:text-teal-600 truncate">
                  {s.name}
                </button>
                <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 ml-2 shrink-0">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

