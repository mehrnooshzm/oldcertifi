import { ChromePicker, CirclePicker } from 'react-color';

// Simple color picker component using ChromePicker and CirclePicker
const ColorPicker = ({ value, handleColorChange }) => {
  return (
    <div className='flex flex-col justify-center items-center gap-[20px]'>
      {/* ChromePicker for detailed color selection */}
      <ChromePicker color={value} onChange={(e) => handleColorChange(e.rgb)} />
      {/* CirclePicker for quick color selection */}
      <CirclePicker color={value} onChange={(e) => handleColorChange(e.rgb)} />
    </div>
  );
};

export default ColorPicker;
