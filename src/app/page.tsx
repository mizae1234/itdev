'use client';

import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import InvestmentSummary from '@/components/InvestmentSummary';
import MonthlyPL from '@/components/MonthlyPL';

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const ROIAnalysis = dynamic(() => import('@/components/ROIAnalysis'), { ssr: false });
const CashFlowChart = dynamic(() => import('@/components/CashFlowChart'), { ssr: false });
const SensitivityAnalysis = dynamic(() => import('@/components/SensitivityAnalysis'), { ssr: false });
const ServiceJourney = dynamic(() => import('@/components/ServiceJourney'), { ssr: false });
const ProjectSummary = dynamic(() => import('@/components/ProjectSummary'), { ssr: false });
const StaffStructure = dynamic(() => import('@/components/StaffStructure'), { ssr: false });
const ExportPDF = dynamic(() => import('@/components/ExportPDF'), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50">
      {/* Sticky Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main id="pdf-content" className="flex-1 p-5 md:p-8 lg:p-10 space-y-10 max-w-6xl">
        <HeroSection />
        <ServiceJourney />
        <StaffStructure />
        <InvestmentSummary />
        <MonthlyPL />
        <ROIAnalysis />
        <CashFlowChart />
        <SensitivityAnalysis />
        <ProjectSummary />

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-gray-400 border-t border-gray-100">
          <p>AION Body & Paint Center — ข้อเสนอธุรกิจ 2026</p>
          <p className="mt-1">เอกสารลับ • สำหรับนักลงทุนเท่านั้น</p>
        </footer>
      </main>

      {/* Export Button */}
      <ExportPDF />
    </div>
  );
}
