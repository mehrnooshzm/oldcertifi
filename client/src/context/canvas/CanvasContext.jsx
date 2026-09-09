import { useState } from 'react';
import { createContext } from 'react';
import { FabricObject } from 'fabric';

// Extend Fabric.js object serialization to include custom properties
FabricObject.prototype.toObject = (function (toObject) {
  return function (propertiesToInclude) {
    return toObject.call(
      this,
      (propertiesToInclude || []).concat(['selectable', 'evented'])
    );
  };
})(FabricObject.prototype.toObject);

// Create context for the canvas editor
export const CanvasContext = createContext(null);

// Provider component to manage canvas-related state
export const CanvasProvider = ({ children }) => {
  const [canvasEditor, setCanvasEditor] = useState(null); // Fabric canvas instance
  const [showCaptions, setShowCaptions] = useState(true); // Toggle captions display
  const [size, setSize] = useState('A4'); // Canvas size
  const [orientation, setOrientation] = useState('landscape'); // Canvas orientation
  const [name, setName] = useState('New Certificate'); // Default certificate name

  return (
    <CanvasContext
      value={{
        canvasEditor,
        setCanvasEditor,
        showCaptions,
        setShowCaptions,
        size,
        setSize,
        orientation,
        setOrientation,
        name,
        setName,
      }}
    >
      {children}
    </CanvasContext>
  );
};
