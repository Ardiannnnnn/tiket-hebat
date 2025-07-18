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
  disabled?: boolean;
  placeholder?: string;
}

export default function SelectInput({
  title,
  id,
  option,
  icon,
  value = "",
  onChange,
  isLoading = false,
  disabled = false,
  placeholder,
}: SelectInputProps) {
  // ✅ Dynamic placeholder logic berdasarkan state
  const getDisplayPlaceholder = () => {
    if (isLoading) return "Memuat...";
    if (disabled && placeholder) return placeholder;
    if (disabled) return "Lengkapi pilihan sebelumnya terlebih dahulu";
    return placeholder || `Pilih ${title.toLowerCase()}`;
  };

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className={`block mb-2 text-sm font-medium transition-colors ${
          disabled ? "text-gray-400" : "text-gray-900"
        }`}
      >
        {title}
      </label>

      <div className="relative">
        {/* Ikon kiri */}
        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 transition-colors ${
          disabled ? "text-gray-400" : "text-Blue"
        }`}>
          {icon}
        </div>

        {/* Ikon kanan custom */}
        <div className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-colors ${
          disabled ? "text-gray-400" : "text-Blue"
        }`}>
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

        <Select 
          onValueChange={onChange} 
          value={value}
          disabled={disabled || isLoading}
        >
          <SelectTrigger
            id={id}
            className={`w-full md:py-5.5 pl-10 pr-10 py-3.5 text-sm bg-gray-50 border-2 rounded-lg 
              focus:outline-none transition-colors appearance-none [&>svg]:hidden
              ${disabled || isLoading 
                ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-300" 
                : "text-gray-900 border-Orange hover:border-Orange/70"
              }`}
          >
            <SelectValue 
              placeholder={getDisplayPlaceholder()} // ✅ Gunakan dynamic placeholder
            />
          </SelectTrigger>

          <SelectContent>
            {isLoading ? (
              <SelectItem disabled value="loading">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-Blue border-t-transparent rounded-full animate-spin"></div>
                  Memuat Data...
                </div>
              </SelectItem>
            ) : disabled ? (
              <SelectItem disabled value="disabled">
                {placeholder || "Pilih opsi sebelumnya terlebih dahulu"}
              </SelectItem>
            ) : option.length === 0 ? (
              <SelectItem disabled value="empty">
                Tidak ada pilihan tersedia
              </SelectItem>
            ) : (
              <>
                {option.map((opt, index) => (
                  <SelectItem key={index} value={opt}>
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
