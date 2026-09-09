import { useState } from 'react';
import {
  ChevronFirst,
  ChevronLast,
  TableProperties,
  Layers,
} from 'lucide-react';
import { useActiveObject } from '@/hooks/useActiveObject';
import TextProperties from './TextProperties';
import ShapeProperties from './ShapeProperties';
import ImageProperties from './ImageProperties';
import LayersList from './LayersList';

const PropertiesSidebar = () => {
  const [activeTab, setActiveTab] = useState('Properties'); // Current active tab
  const [isOpen, setIsOpen] = useState(true); // Sidebar open/collapse state

  const activeObject = useActiveObject(); // Currently selected canvas object

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(true); // Ensure sidebar opens when selecting tab from collapsed state
  };

  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } bg-[#373737] text-white`}
      style={{ background: 'var(--gradient-dark-color)' }}
    >
      {/* Collapse / Expand Button */}
      <div className='flex flex-col items-start p-4 transition-all duration-300'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-200 text-black transition-all duration-300'
        >
          {isOpen ? <ChevronLast size={18} /> : <ChevronFirst size={18} />}
        </button>

        {/* Tabs */}
        {isOpen ? (
          <div className='flex gap-2 mt-3 w-full'>
            {['Properties', 'Layers'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 px-3 py-2 text-sm font-semibold border-b-2 transition-opacity duration-200 rounded-tl rounded-tr ${
                  activeTab === tab
                    ? 'border-white opacity-100'
                    : 'border-gray-600 opacity-40 hover:opacity-80 hover:bg-[#4A4A4A]'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-2 mt-3 w-full items-center'>
            <button
              onClick={() => handleTabClick('Properties')}
              className='p-2 rounded-lg hover:bg-[var(--button-hover-color-on)]'
            >
              <TableProperties size={20} />
            </button>
            <button
              onClick={() => handleTabClick('Layers')}
              className='p-2 rounded-lg hover:bg-[var(--button-hover-color-on)]'
            >
              <Layers size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div
        className={`flex-1 p-6 pt-0 overflow-y-auto transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 h-0'
        }`}
      >
        {activeTab === 'Properties' && (
          <div className='space-y-2'>
            {['i-text', 'textbox', 'dynamic-field-text'].includes(
              activeObject?.type
            ) ? (
              <TextProperties />
            ) : ['rect', 'circle', 'triangle'].includes(activeObject?.type) ? (
              <ShapeProperties />
            ) : activeObject?.type === 'image' ? (
              <ImageProperties />
            ) : (
              <div className='flex flex-col gap-1 text-gray-400 text-sm text-center'>
                <p>No object selected.</p>
                <p>Click an object to see and customize its properties.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'Layers' && <LayersList />}
      </div>
    </aside>
  );
};

export default PropertiesSidebar;
