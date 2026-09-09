import { applyPageSettings } from '@/utils/canvasSettings';

export const loadTemplateIntoCanvas = (
  canvasEditor,
  setSize,
  setOrientation,
  template
) => {
  // Load the canvas objects from the template JSON
  canvasEditor.loadFromJSON(template.canvasData, () => {
    canvasEditor.requestRenderAll();
    canvasEditor.getObjects().forEach((obj) => obj.set('dirty', true));
  });

  // Apply page size and orientation if specified in template
  if (template.size && template.orientation) {
    setSize(template.size);
    setOrientation(template.orientation);
    applyPageSettings(canvasEditor, template.size, template.orientation);
  }
};
