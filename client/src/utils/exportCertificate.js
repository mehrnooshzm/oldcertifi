import { PDFDocument } from 'pdf-lib';
import { pageSizes } from './canvasSettings';

export const exportCertificateToPNG = (canvas) => {
  if (!canvas) return;

  // Export at double resolution
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1.0,
    multiplier: 2, // High resolution export
  });

  // Download image
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `design-${Date.now()}.png`;
  link.click();
};

// Export the Fabric.js canvas as a PDF
export const exportCertificateToPDF = async (canvas, pageSize, orientation) => {
  if (!canvas) return;

  try {
    const pdfDoc = await PDFDocument.create();

    const { width, height } = pageSizes[pageSize][orientation];

    // Export canvas as high-res PNG
    const pngDataUrl = canvas.toDataURL({
      format: 'png',
      multiplier: 2, // for high resolution for PDF
    });

    const pngImageBytes = await fetch(pngDataUrl).then((res) =>
      res.arrayBuffer()
    );
    const canvasImg = await pdfDoc.embedPng(pngImageBytes);

    // Maintain aspect ratio
    const imgWidth = canvasImg.width;
    const imgHeight = canvasImg.height;

    let drawWidth = width;
    let drawHeight = (imgHeight * width) / imgWidth;

    if (drawHeight > height) {
      drawHeight = height;
      drawWidth = (imgWidth * height) / imgHeight;
    }

    // Add page and draw image
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(canvasImg, {
      x: 0,
      y: 0,
      width: drawWidth,
      height: drawHeight,
    });

    // Save PDF and trigger download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `design-${Date.now()}.pdf`;
    link.click();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
