import { Download } from 'lucide-react';
import { useCanvasContext } from '@/hooks/useCanvasContext';
import {
  exportCertificateToPNG,
  exportCertificateToPDF,
} from '@/utils/exportCertificate';
import withHiddenCaptions from '@/utils/withHiddenCaptions';

const ExportToPNGandPDF = () => {
  const { canvasEditor, size, orientation } = useCanvasContext(); // get canvas and layout info

  // Export the certificate as PNG
  const handleExportToPNG = async () => {
    await withHiddenCaptions(canvasEditor, async () => {
      exportCertificateToPNG(canvasEditor);
    });
  };

  // Export the certificate as PDF
  const handleExportToPDF = async () => {
    await withHiddenCaptions(canvasEditor, async () => {
      exportCertificateToPDF(canvasEditor, size, orientation);
    });
  };

  return (
    <div className='flex gap-2'>
      {/* PNG Export Button */}
      <button
        onClick={handleExportToPNG}
        className='flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-white bg-[var(--secondary-color)] transition-colors hover:bg-[var(--button-hover-color-out)] hover:text-[var(--primary-color)]'
      >
        <Download className='h-4 w-4' />
        PNG
      </button>

      {/* PDF Export Button */}
      <button
        onClick={handleExportToPDF}
        className='flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-white bg-[var(--secondary-color)] transition-colors hover:bg-[var(--button-hover-color-out)] hover:text-[var(--primary-color)]'
      >
        <Download className='h-4 w-4' />
        PDF
      </button>
    </div>
  );
};

export default ExportToPNGandPDF;
