import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import CSVUpload from './CSVUpload';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCanvasContext } from '@/hooks/useCanvasContext';
import { toolboxOptions } from '@/constants/editorSettings.jsx';
import { applyPageSettings } from '@/utils/canvasSettings';
import TemplatePicker from './TemplatePicker';

const HorizontalLine = () => <hr className='bg-gray-600 my-3' />;

const DesignToolbox = () => {
  const [openPopover, setOpenPopover] = useState(null);
  const { canvasEditor, size, setSize, orientation, setOrientation } =
    useCanvasContext();
  const { id } = useParams();

  // Get design from Redux if editing an existing design
  const design = useSelector(({ designs }) =>
    id ? designs.find((design) => design.id === id) : null
  );

  const titleStyles = 'text-xs font-semibold text-gray-300';
  const buttonStyles =
    'px-2 py-1 rounded bg-[#B3B3B3] hover:bg-[var(--button-hover-color-out)] text-white hover:text-[var(--primary-color)] text-xs';

  // Set initial page size and orientation from design
  useEffect(() => {
    if (design) {
      setSize(design.size);
      setOrientation(design.orientation);
    }
  }, []);

  // Apply page settings to canvas whenever size or orientation changes
  useEffect(() => {
    if (!canvasEditor) return;

    applyPageSettings(canvasEditor, size, orientation);

    // Scale canvas to fit its container
    const container = canvasEditor.wrapperEl?.parentNode;
    if (container) {
      const scale = Math.min(
        container.clientWidth / canvasEditor.width,
        container.clientHeight / canvasEditor.height
      );
      canvasEditor.setViewportTransform([scale, 0, 0, scale, 0, 0]);
      canvasEditor.renderAll();
    }
  }, [canvasEditor, size, orientation]);

  // Update page size
  const handleSizeClick = (newSize) => {
    if (!canvasEditor) return;
    setSize(newSize);
    applyPageSettings(canvasEditor, newSize, orientation);
  };

  // Update page orientation
  const handleOrientationClick = (newOrientation) => {
    if (!canvasEditor) return;
    setOrientation(newOrientation);
    applyPageSettings(canvasEditor, size, newOrientation);
  };

  return (
    <aside
      className='hidden md:flex flex-col w-64 text-white p-6 space-y-2 h-full overflow-y-auto'
      style={{ background: 'var(--gradient-dark-color)' }}
    >
      {/* Dashboard */}
      <Link
        to='/'
        className='text-lg font-semibold hover:text-[var(--tertiary-color)]'
      >
        Dashboard
      </Link>
      <HorizontalLine />

      {/* Templates */}
      <TemplatePicker
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      />

      <HorizontalLine />

      {/* Page Size & Orientation */}
      <section>
        <span className='text-[0.94rem] font-semibold flex justify-between items-center mb-2'>
          Page Settings
        </span>
        <span className={titleStyles}>Page Size</span>
        <div className=' flex space-x-2 mt-1 mb-2'>
          <button
            className={`w-1/2 ${buttonStyles} ${size === 'A4' ? 'bg-[var(--button-hover-color-on)]' : ''}`}
            onClick={() => handleSizeClick('A4')}
          >
            A4
          </button>
          <button
            className={`w-1/2 ${buttonStyles} ${size === 'letter' ? 'bg-[var(--button-hover-color-on)]' : ''}`}
            onClick={() => handleSizeClick('letter')}
          >
            Letter
          </button>
        </div>

        <span className={titleStyles}>Page Orientation</span>
        <div className='flex space-x-2 mt-1 mb-2'>
          <button
            className={`w-1/2 ${buttonStyles} ${orientation === 'landscape' ? 'bg-[var(--button-hover-color-on)]' : ''}`}
            onClick={() => handleOrientationClick('landscape')}
          >
            Landscape
          </button>
          <button
            className={`w-1/2 ${buttonStyles} ${orientation === 'portrait' ? 'bg-[var(--button-hover-color-on)]' : ''}`}
            onClick={() => handleOrientationClick('portrait')}
          >
            Portrait
          </button>
        </div>
      </section>

      <HorizontalLine />

      {/* Toolbox Options */}
      <section className='space-y-2'>
        {toolboxOptions.map(({ name, component }) => (
          <Popover
            key={name}
            open={openPopover === name}
            onOpenChange={(isOpen) => setOpenPopover(isOpen ? name : null)}
          >
            <PopoverTrigger className='flex w-full justify-between items-center gap-1 px-0 py-1 text-white text-[0.94rem] font-semibold hover:opacity-80'>
              <span>{name}</span>
              {openPopover === name ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </PopoverTrigger>
            <PopoverContent
              side='right'
              sideOffset={30}
              className='w-64 bg-[#373737] border-0 text-gray-300 p-3 rounded-none shadow-lg space-y-2 text-xs'
              style={{ background: 'var(--gradient-dark-color)' }}
            >
              {component}
            </PopoverContent>
          </Popover>
        ))}
      </section>

      {/* CSV Upload */}
      <section className='flex justify-between items-center text-[0.94rem] font-semibold '>
        <CSVUpload />
      </section>
    </aside>
  );
};

export default DesignToolbox;
