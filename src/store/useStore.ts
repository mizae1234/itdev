import { create } from 'zustand';

interface Inputs {
  constructionCost: number;
  equipmentCost: number;
  jobsPerMonth: number;
  pricePerJob: number;
  cogsPercent: number;
  staffCost: number;
  rent: number;
  paintCost: number;
  utilities: number;
  misc: number;
  software: number;
  capacityPercent: number;
}

interface Derived {
  initialInvestment: number;
  revenue: number;
  cogs: number;
  totalFixedCosts: number;
  totalCost: number;
  netProfitMonthly: number;
  netProfitYearly: number;
  roiPercent: number;
  paybackMonths: number;
  breakEvenJobs: number;
}

interface Store extends Inputs {
  derived: Derived;
  setField: (field: keyof Inputs, value: number) => void;
}

function calcDerived(s: Inputs): Derived {
  const initialInvestment = s.constructionCost + s.equipmentCost;
  const effectiveJobs = Math.round(s.jobsPerMonth * (s.capacityPercent / 100));
  const revenue = effectiveJobs * s.pricePerJob;
  const cogs = revenue * (s.cogsPercent / 100);
  const totalFixedCosts = s.staffCost + s.rent + s.paintCost + s.utilities + s.misc + s.software;
  const totalCost = cogs + totalFixedCosts;
  const netProfitMonthly = revenue - totalCost;
  const netProfitYearly = netProfitMonthly * 12;
  const roiPercent = initialInvestment > 0 ? (netProfitYearly / initialInvestment) * 100 : 0;
  const paybackMonths = netProfitMonthly > 0 ? Math.ceil(initialInvestment / netProfitMonthly) : Infinity;

  const marginPerJob = s.pricePerJob * (1 - s.cogsPercent / 100);
  const breakEvenJobs = marginPerJob > 0 ? Math.ceil(totalFixedCosts / marginPerJob) : Infinity;

  return {
    initialInvestment,
    revenue,
    cogs,
    totalFixedCosts,
    totalCost,
    netProfitMonthly,
    netProfitYearly,
    roiPercent,
    paybackMonths,
    breakEvenJobs,
  };
}

const defaults: Inputs = {
  constructionCost: 10_000_000,
  equipmentCost: 4_000_000,
  jobsPerMonth: 200,
  pricePerJob: 25_000,
  cogsPercent: 70,
  staffCost: 430_000,
  rent: 70_000,
  paintCost: 300_000,
  utilities: 120_000,
  misc: 100_000,
  software: 30_000,
  capacityPercent: 100,
};

export const useStore = create<Store>((set) => ({
  ...defaults,
  derived: calcDerived(defaults),
  setField: (field, value) =>
    set((state) => {
      const next = { ...state, [field]: value };
      return { [field]: value, derived: calcDerived(next) };
    }),
}));
