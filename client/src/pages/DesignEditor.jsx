import { useState, useEffect, useRef } from 'react';
import { CanvasProvider } from '@/context/canvas';
import { CSVDataProvider } from '@/context/csvData';
import { Toaster } from '@/components/ui/sonner';
import CanvasEditor from '../features/canvas/CanvasEditor';
import DesignEditorNavbar from '../features/designNavbar/DesignEditorNavbar';
import DesignToolbox from '../features/designToolbox/DesignToolbox';
import PropertiesSidebar from '../features/properties/PropertiesSidebar';
import ContextMenu from '../features/canvas/ContextMenu';

const DesignEditor = () => {
  const [blockHeight, setBlockHeight] = useState(0); // Dynamic height for editor layout
  const blockRef = useRef(null); // Ref to the main editor container

  // Adjust editor height based on window size and header heights
  useEffect(() => {
    const header = document.querySelector('#mainHeader');
    const subheader = document.querySelector('#editorSubheader');

    const resize = () =>
      setBlockHeight(
        window.innerHeight - (header.offsetHeight + subheader.offsetHeight)
      );
    resize();

    window.addEventListener('resize', resize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <CanvasProvider>
      <CSVDataProvider>
        {/* Navbar */}
        <DesignEditorNavbar />
        <Toaster />
        {/* Main layout */}
        <div
          className='flex justify-between overflow-hidden'
          ref={blockRef}
          style={{ height: `${blockHeight}px` }}
        >
          {/* Left toolbox */}
          <div className='h-full'>
            <DesignToolbox />
          </div>
          {/* Main editor section */}
          <div className='flex flex-col flex-1'>
            <div className='w-full flex flex-1 justify-center items-center'>
              <CanvasEditor />
              <ContextMenu />
            </div>
          </div>
          {/* Right Toolbox */}
          <div className='h-full'>
            <PropertiesSidebar />
          </div>
        </div>
      </CSVDataProvider>
    </CanvasProvider>
  );
};

export default DesignEditor;
