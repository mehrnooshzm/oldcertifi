import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// CustomSelect component wraps a select dropdown with styling and options
const CustomSelect = ({
  value,
  options,
  onChange,
  placeholder = 'Select an option',
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-full !h-auto px-3 py-1 text-white font-normal border-0 rounded bg-neutral-600'>
        <SelectValue placeholder={placeholder} className='text-sm' />
      </SelectTrigger>
      <SelectContent className='max-h-60 overflow-y-auto'>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className='text-sm px-2 py-1'>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
