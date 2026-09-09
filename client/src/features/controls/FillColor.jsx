import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCanvasContext } from '@/hooks/useCanvasContext';
import { useActiveObject } from '@/hooks/useActiveObject';
import ColorPicker from './ColorPicker';

const FillColor = () => {
  const [color, setColor] = useState('rgba(0, 0, 0, 1)');
  const { canvasEditor } = useCanvasContext();
  const activeObject = useActiveObject();

  // Update local state when active object changes
  useEffect(() => {
    if (activeObject) {
      setColor(activeObject.fill);
    }
  }, [activeObject]);

  // Handle color change from the color picker
  const handleColorChange = ({ r, g, b, a }) => {
    if (!canvasEditor || !activeObject) return;

    const color = `rgba(${r}, ${g}, ${b}, ${a})`;

    setColor(color);

    // Update the fill color of the active object on canvas
    activeObject.set({ fill: color });
    canvasEditor.renderAll();
  };

  return (
    <div className='flex items-center justify-between'>
      <span className='text-sm font-medium'>Fill Color</span>

      <Popover>
        {/* Popover trigger to show the color picker */}
        <PopoverTrigger
          className='w-10 h-5 bg-transparent cursor-pointer'
          style={{
            backgroundColor: color,
          }}
        ></PopoverTrigger>

        {/* Popover content containing the color picker */}
        <PopoverContent
          side='left'
          align='start'
          sideOffset={10}
          className='w-64 p-3'
          style={{ background: 'var(--gradient-dark-color)' }}
        >
          <ColorPicker value={color} handleColorChange={handleColorChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FillColor;
