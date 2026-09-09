import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { Canvas } from 'fabric';
import { useCanvasContext } from '@/hooks/useCanvasContext';
import { loadTemplateIntoCanvas } from '@/utils/loadTemplate';

const CanvasEditor = () => {
  const canvasRef = useRef(); // Reference to the canvas DOM element
  const [, setCanvas] = useState(null); // Local state for the Fabric canvas instance
  const { canvasEditor, setCanvasEditor, setSize, setOrientation } =
    useCanvasContext(); // Access shared canvas context
  const { id } = useParams(); // Get design ID from URL (undefined for new designs)

  const location = useLocation();
  const template = location.state?.template; // Optional template passed via navigation

  // Get existing canvas data from Redux if editing an existing design
  const canvasData = useSelector(({ designs }) => {
    if (!id) return null; // No data for new design

    const design = designs.find((design) => design.id === id);
    return design ? design.canvasData : null;
  });

  // Initialize the Fabric canvas
  useEffect(() => {
    if (canvasRef.current) {
      const initialCanvas = new Canvas(canvasRef.current, {
        width: 1280 / 1.5,
        height: 720 / 1.5,
        backgroundColor: 'white',
      });

      // High-resolution setup for retina displays
      const scaleFactor = window.devicePixelRatio || 1;
      initialCanvas.set({
        width: 1280 * scaleFactor,
        height: 720 * scaleFactor,
        zoom: 1 / scaleFactor,
      });

      // Load existing design if available
      if (canvasData) {
        initialCanvas.loadFromJSON(canvasData, () => {
          initialCanvas.requestRenderAll();

          // Mark objects as dirty so the preview updates correctly
          initialCanvas.getObjects().forEach((obj) => obj.set('dirty', true));
        });
      }

      initialCanvas.renderAll();

      setCanvas(initialCanvas);
      setCanvasEditor(initialCanvas);

      // Cleanup canvas on component unmount
      return () => {
        initialCanvas.dispose();
      };
    }
  }, [setCanvasEditor, canvasData]);

  // Load a template into the canvas if provided
  useEffect(() => {
    if (!template || !canvasEditor) return;

    loadTemplateIntoCanvas(canvasEditor, setSize, setOrientation, template);
  }, [template, canvasEditor]);

  // Listen for canvas changes (add, modify, remove objects)
  useEffect(() => {
    if (!canvasEditor) return;

    const handleChange = () => {
      const json = canvasEditor.toJSON();
      console.log('Canvas updated JSON:', json); // Could later be used for autosave
    };

    canvasEditor.on('object:modified', handleChange);
    canvasEditor.on('object:added', handleChange);
    canvasEditor.on('object:removed', handleChange);

    // Cleanup event listeners on unmount
    return () => {
      canvasEditor.off('object:modified', handleChange);
      canvasEditor.off('object:added', handleChange);
      canvasEditor.off('object:removed', handleChange);
    };
  }, [canvasEditor]);

  return (
    <div className='canvas-responsive-container'>
      <canvas id='canvas' ref={canvasRef}></canvas>
    </div>
  );
};

export default CanvasEditor;
