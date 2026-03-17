'use client';

import { useState } from 'react';

export default function ExportPDF() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');

      const content = document.getElementById('pdf-content');
      if (!content) return;

      // Temporarily expand for full capture
      const originalOverflow = content.style.overflow;
      content.style.overflow = 'visible';

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f9fafb',
        logging: false,
        windowWidth: 1200,
      });

      content.style.overflow = originalOverflow;

      const imgWidth = 297; // A4 landscape width (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 210; // A4 landscape height (mm)

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      let position = 0;
      let remainingHeight = imgHeight;
      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      // Multi-page
      while (remainingHeight > 0) {
        if (position > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', 0, -position, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        position += pageHeight;
      }

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      pdf.save(`AION_Business_Proposal_${dateStr}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Export ล้มเหลว กรุณาลองใหม่');
    }
    setExporting(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-2xl shadow-lg hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center gap-2 print:hidden"
    >
      {exporting ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          กำลัง Export...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          📄 Export PDF
        </>
      )}
    </button>
  );
}
