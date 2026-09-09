import { useRef } from 'react';
import { FabricImage } from 'fabric';
import { useCanvasContext } from '@/hooks/useCanvasContext';
import { Upload } from 'lucide-react';
import { supabase } from '@/supabase/supabase';

const ImageUpload = () => {
  const { canvasEditor } = useCanvasContext();
  const fileInputRef = useRef(null);

  // Handle image selection and upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file || !canvasEditor) return;

    const fileName = `${Date.now()}-${file.name}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
    }

    // Get public URL of uploaded image
    const { data: url } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(fileName);

    // Load image into Fabric canvas
    const canvasImageRef = await FabricImage.fromURL(url.publicUrl, {
      crossOrigin: 'anonymous',
    });

    // Scale image to fit canvas while maintaining aspect ratio
    const scaleFactor = Math.min(
      (canvasEditor.width * 0.7) / canvasImageRef.width,
      (canvasEditor.height * 0.7) / canvasImageRef.height
    );

    canvasImageRef.scale(scaleFactor);
    canvasImageRef.set({
      left: (canvasEditor.width - canvasImageRef.width * scaleFactor) / 2,
      top: (canvasEditor.height - canvasImageRef.height * scaleFactor) / 2,
      selectable: true,
      hasControls: true,
      hasBorders: true,
    });

    // Add image to canvas
    canvasEditor.add(canvasImageRef);
    canvasEditor.renderAll();
  };

  return (
    <div className='space-y-4'>
      {/* Upload button with icon */}
      <div className='flex flex-col items-center p-1   cursor-pointer'>
        <Upload className='w-8 h-8 mb-2 text-gray-400' />
        <label className='px-3 py-1 rounded bg-[var(--secondary-color)] hover:bg-[var(--tertiary-color)] hover:text-black text-white text-xs cursor-pointer transition-colors'>
          Select Image
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
          />
        </label>
        <p className='text-xs text-gray-400 mt-2 text-center'>
          JPG, PNG or SVG files
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
