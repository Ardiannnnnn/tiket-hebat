import { JSX } from "react";

interface SelectInputProps {
  title: string;
  id: string;
  option: string[];
  icon: JSX.Element;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SelectInput({
  title,
  id,
  option,
  icon,
  value = '',
  onChange,
}: SelectInputProps) {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {title}
      </label>
      <div className="relative">
        {/* Ikon */}
        <div className="absolute inset-y-0 left-3 flex items-center text-Blue">
          {icon}
        </div>

        <select
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-gray-50 border-2 border-Orange text-gray-900 text-sm rounded-lg 
            focus:ring-blue-500 focus:border-Orange block w-full p-3.5 pl-10 pr-10 appearance-none focus:outline-none"
        >
          <option value="" disabled>
            {title}
          </option>
          {option.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Ikon Dropdown */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-Blue"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
