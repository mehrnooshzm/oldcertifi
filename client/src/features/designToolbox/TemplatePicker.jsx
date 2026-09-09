import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCanvasContext } from '@/hooks/useCanvasContext';
import { loadTemplateIntoCanvas } from '@/utils/loadTemplate';
import templateService from '@/services/templates';
import TemplateItem from './TemplateItem';

const TemplatePicker = ({ openPopover, setOpenPopover }) => {
  const [templates, setTemplates] = useState([]);

  const { canvasEditor, setSize, setOrientation } = useCanvasContext();

  // Fetch all available templates on component mount
  useEffect(() => {
    const getTemplates = async () => {
      const templates = await templateService.getAll();
      setTemplates(templates);
    };

    getTemplates();
  }, []);

  // Load the selected template into the canvas
  const handleItemClick = (template) => {
    if (!canvasEditor) return;

    loadTemplateIntoCanvas(canvasEditor, setSize, setOrientation, template);
  };

  return (
    <Popover
      open={openPopover === 'Templates'}
      onOpenChange={(isOpen) => setOpenPopover(isOpen ? 'Templates' : null)}
    >
      {/* Popover trigger button */}
      <PopoverTrigger className='flex justify-between items-center text-[0.94rem] font-semibold hover:opacity-80'>
        <span>Templates</span>
        {openPopover === 'Templates' ? (
          <ChevronDown size={14} />
        ) : (
          <ChevronRight size={14} />
        )}
      </PopoverTrigger>

      {/* Popover content with template list */}
      <PopoverContent
        side='right'
        align='start'
        sideOffset={30}
        className='w-64 max-h-[500px] overflow-y-scroll bg-[#373737] border-0 text-gray-300 p-3 rounded-none shadow-lg space-y-2 text-xs'
        style={{ background: 'var(--gradient-dark-color)' }}
      >
        <div className='flex flex-wrap justify-between space-y-4'>
          {/* Render each template */}
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleItemClick(template)}
              className='cursor-pointer'
            >
              <TemplateItem template={template} />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TemplatePicker;
