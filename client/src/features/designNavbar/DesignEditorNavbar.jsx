import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '@/supabase/supabase';
import { useCanvasContext } from '@/hooks/useCanvasContext';
import { useCSVDataContext } from '@/hooks/useCSVDataContext';
import { createDesign, updateDesign } from '@/reducers/designReducer';
import { toast } from 'sonner';
import { Save as SaveIcon, LoaderCircle } from 'lucide-react';
import ExportToPNGandPDF from './ExportToPNGandPDF';
import CertificateName from './CertificateName';

const DesignEditorNavbar = () => {
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { canvasEditor, showCaptions, size, orientation, name } =
    useCanvasContext();
  const { CSVData, previewRowIndex } = useCSVDataContext();
  const { id } = useParams(); // undefined when the URL is `/designs/new`

  // If editing an existing design, retrieve it from Redux
  const design = useSelector(({ designs }) => {
    if (!id) return null; // new design -> no canvas data

    return designs.find((design) => design.id === id) || null;
  });

  const dispatch = useDispatch();

  // Save or update design
  const handleSave = async () => {
    if (isSaving) return; // prevent double-trigger

    setIsSaving(true);

    // Generate PNG preview
    const fileName = `design-preview-${Date.now()}.png`;
    const dataURL = canvasEditor.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 2,
    });
    const blob = await (await fetch(dataURL)).blob();

    try {
      // Upload new preview image to Supabase
      const { error } = await supabase.storage
        .from('user-design-previews')
        .upload(fileName, blob, { contentType: 'image/png' });

      if (error) {
        throw new Error('Upload error:', error);
      }

      const { data: url } = supabase.storage
        .from('user-design-previews')
        .getPublicUrl(fileName);

      if (design) {
        // Delete previous preview image
        const { error } = await supabase.storage
          .from(design.designPreview.bucket)
          .remove([design.designPreview.fileName]); // remove expects an array

        if (error) {
          throw new Error(
            'Failed to delete image:',
            design.designPreview.fileName,
            error
          );
        }

        // Update existing design in Redux
        const updatedDesign = {
          ...design,
          name,
          canvasData: canvasEditor.toJSON(),
          designPreview: {
            fileName,
            bucket: 'user-design-previews',
            url: url.publicUrl,
          },
          size,
          orientation,
          showCaptions,
          csvUploadId: CSVData?.id,
          csvRowIndex: previewRowIndex,
        };
        await dispatch(updateDesign(updatedDesign));
      } else {
        // Create new design
        const newDesign = {
          name,
          canvasData: canvasEditor.toJSON(),
          designPreview: {
            fileName,
            bucket: 'user-design-previews',
            url: url.publicUrl,
          },
          size,
          orientation,
          showCaptions,
          csvUploadId: CSVData?.id,
          csvRowIndex: previewRowIndex,
        };

        const createdDesign = await dispatch(createDesign(newDesign));
        navigate(`/designs/${createdDesign.id}`); // navigate to new design
      }

      toast('Design saved successfully!');
    } catch (e) {
      console.error(e);
      toast('Failed to save the design.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id='editorSubheader'
      className='flex gap-5 bg-[var(--primary-color)] py-5 px-[90px]'
    >
      <CertificateName /> {/* Editable certificate title */}
      <button
        className='ml-auto flex items-center gap-1 p-2 text-white font-medium rounded-md transition-colors hover:text-[var(--primary-color)] hover:bg-[var(--button-hover-color-out)] disabled:opacity-60'
        onClick={handleSave}
        disabled={isSaving} // disable button while saving
      >
        {isSaving ? (
          <>
            <LoaderCircle className='animate-spin' size={20} />
            Saving...
          </>
        ) : (
          <>
            <SaveIcon size={20} />
            Save Design
          </>
        )}
      </button>
      <ExportToPNGandPDF />
    </div>
  );
};

export default DesignEditorNavbar;
