import { Circle, Rect, Triangle } from 'fabric';
import { useCanvasContext } from '@/hooks/useCanvasContext';
import { shapesOptions } from '@/constants/shapesOptions';

const ShapesOptions = () => {
  const { canvasEditor } = useCanvasContext();
  // Handle adding shape to canvas
  const handleShapeClick = (shapeName) => {
    if (!canvasEditor) return;
    // Default properties for all shapes
    const properties = {
      width: 100,
      height: 100,
      top: 100,
      left: 100,
      radius: 50,
      fill: '#000000',
      stroke: '#000000',
      strokeWidth: 0,
    };

    let shapeRef;
    // Create shape instance based on selected type
    switch (shapeName) {
      case 'Circle':
        shapeRef = new Circle({ ...properties });
        break;
      case 'Square':
        shapeRef = new Rect({ ...properties });
        break;
      case 'Triangle':
        shapeRef = new Triangle({ ...properties });
        break;
      default:
        break;
    }
    // Add shape to canvas and render
    canvasEditor.add(shapeRef);
    canvasEditor.renderAll();
  };

  return (
    <div className='flex justify-center items-center gap-5'>
      {/* Render shape buttons */}
      {shapesOptions.map(({ name, icon: Icon }) => (
        <button
          key={name}
          className='flex justify-center items-center p-2 rounded-xl border border-[#dfdfdf] hover:scale-125 transition-all'
          onClick={() => handleShapeClick(name)}
        >
          <Icon size={24} style={{ pointerEvents: 'none' }} />
        </button>
      ))}
    </div>
  );
};

export default ShapesOptions;
