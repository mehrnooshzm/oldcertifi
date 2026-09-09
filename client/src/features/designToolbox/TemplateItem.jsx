const TemplateItem = ({ template }) => {
  const { id, name, designPreview } = template;

  return (
    <div
      key={id}
      className='bg-gray-50 border-1 border-gray-200 rounded-lg overflow-hidden aspect-[4/3] flex flex-col'
    >
      {/* Design preview image */}
      <div className='flex-1 overflow-hidden'>
        <img
          src={designPreview.url}
          alt='Design preview image'
          className='w-full h-full object-cover'
        />
      </div>

      {/* Template name */}
      <div className='bg-[var(--primary-color)] text-white text-[0.65rem] text-left pl-3 font-semibold flex items-center justify-between py-2'>
        <span className='truncate'>{name}</span>
      </div>
    </div>
  );
};

export default TemplateItem;
