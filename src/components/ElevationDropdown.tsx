import React from 'react';
import { Mountain } from 'lucide-react';
import { ElevationFilter } from '../types';

interface ElevationFilterProps {
  value: ElevationFilter;
  onChange: (filter: ElevationFilter) => void;
}

const filterOptions: { label: string; value: ElevationFilter }[] = [
  { label: 'All Heights', value: null },
  { label: '< 1000m', value: [0, 1000] },
  { label: '1000m - 1250m', value: [1000, 1250] },
  { label: '1250m - 1500m', value: [1250, 1500] },
  { label: '1500m - 1750m', value: [1500, 1750] },
  { label: '1750m - 2000m', value: [1750, 2000] },
  { label: '2000m - 2500m', value: [2000, 2500] },
  { label: '> 2500m', value: [2500, 10000] },
];

export default function ElevationDropdown({ value, onChange }: ElevationFilterProps) {
  // Find current label to display in a standard select
  const stringValue = value ? `${value[0]}-${value[1]}` : 'all';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      onChange(null);
    } else {
      const [min, max] = val.split('-').map(Number);
      onChange([min, max]);
    }
  };

  return (
    <div className="bg-[#FDFCF8]/95 backdrop-blur-md border border-[#E5E2D9] shadow-sm rounded-xl py-2 px-3 flex items-center gap-3">
      <div className="flex flex-col">
        <label htmlFor="elevation-select" className="text-[10px] uppercase font-semibold tracking-wider text-[#2A2A25]/60 pl-1">
          Altitude Range
        </label>
        <select
          id="elevation-select"
          className="bg-transparent text-sm font-bold text-[#5A5A40] focus:outline-none focus:ring-0 cursor-pointer appearance-none pl-1 pr-6"
          value={stringValue}
          onChange={handleChange}
        >
          {filterOptions.map((opt) => (
            <option key={opt.label} value={opt.value ? `${opt.value[0]}-${opt.value[1]}` : 'all'}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-[#E5E2D9] px-2 py-0.5 rounded-full text-[#5A5A40] text-[10px] font-bold">m</div>
    </div>
  );
}
