// Predefined page sizes in pixels for common formats
export const pageSizes = {
  A4: {
    portrait: { width: 595, height: 842 },
    landscape: { width: 842, height: 595 },
  },
  letter: {
    portrait: { width: 612, height: 792 },
    landscape: { width: 792, height: 612 },
  },
};

// Apply page size and orientation settings to a Fabric.js canvas
export function applyPageSettings(canvas, pageSize, orientation) {
  if (!canvas || !pageSizes[pageSize]) return;

  const { width, height } = pageSizes[pageSize][orientation];
  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.setZoom(1);

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  canvas.calcOffset();
  canvas.renderAll();
}
