import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { JSX } from "react";

interface SelectInputProps {
  title: string;
  id: string;
  option: string[];
  icon: JSX.Element;
  value?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
}

export default function SelectInput({
  title,
  id,
  option,
  icon,
  value = "",
  onChange,
  isLoading = false,
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
        {/* Ikon kiri */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-Blue">
          {icon}
        </div>

        {/* Ikon kanan custom */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-Blue">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
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

        <Select onValueChange={onChange} value={value}>
          <SelectTrigger
            id={id}
            className="w-full md:py-5.5 pl-10 pr-10 py-3.5 text-sm text-gray-900 bg-gray-50 border-2 border-Orange rounded-lg 
              focus:outline-none disabled:opacity-70 
              transition-colors appearance-none [&>svg]:hidden"
          >
            <SelectValue placeholder={title} />
          </SelectTrigger>

          <SelectContent>
            {isLoading ? (
              <SelectItem disabled value="loading">
                Memuat Data...
              </SelectItem>
            ) : (
                <>
                <SelectItem disabled value={title}>
                  {title}
                </SelectItem>
                {option.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
