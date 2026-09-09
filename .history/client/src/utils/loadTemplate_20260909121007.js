import {
  applyPageSettings,
  fitCanvasToContainer,
} from '@/utils/canvasSettings';
import { DEFAULT_PREVIEW_IMAGE } from '@/constants/imagePlaceholders';

// Checks whether an image URL actually loads. Resolves true/false —
// never rejects, so it's safe to use in Promise.all.
const checkImageExists = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

// Deep-clones canvasData and swaps any broken image `src` values for the
// placeholder BEFORE handing it to Fabric — this avoids Fabric's internal
// image-loading promise chain rejecting and blanking the whole canvas.
const sanitizeCanvasData = async (canvasData) => {
  const clone = JSON.parse(JSON.stringify(canvasData));
  const objects = clone.objects || [];

  await Promise.all(
    objects.map(async (obj) => {
      const isImage = obj.type?.toLowerCase() === 'image';
      if (!isImage || !obj.src) return;

      const exists = await checkImageExists(obj.src);
      if (!exists) {
        obj.src = DEFAULT_PREVIEW_IMAGE;
      }
    })
  );

  return clone;
};

export const loadTemplateIntoCanvas = async (
  canvasEditor,
  setSize,
  setOrientation,
  template,
  setName
) => {
  // Validate/replace broken image URLs first, so one missing image can't
  // silently blank out the entire canvas render.
  const safeCanvasData = await sanitizeCanvasData(template.canvasData);

  // Load the canvas objects from the (sanitized) template JSON
  canvasEditor.loadFromJSON(safeCanvasData, () => {
    canvasEditor.requestRenderAll();
    canvasEditor.getObjects().forEach((obj) => obj.set('dirty', true));
  });

  // Apply page size and orientation if specified in template
  if (template.size && template.orientation && template.name) {
    setSize(template.size);
    setName(template.name);
    setOrientation(template.orientation);
    applyPageSettings(canvasEditor, template.size, template.orientation);

    // Always re-fit to the container here — DesignToolbox's own effect only
    // re-fits when size/orientation actually change, so if the template's
    // size/orientation match the current state (e.g. default A4 landscape),
    // that effect won't re-fire and the canvas would be left at full,
    // unscaled size, overflowing mobile/tablet viewports.
  }
};
