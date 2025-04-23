"use client";

import { Input } from "@/components/ui/input";
import { ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onBackClick?: () => void;
}

export const SearchBar = ({
  onSearch,
  value,
  onChange,
  placeholder = "Search food here..",
  onBackClick,
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="w-full bg-primary text-white px-6 py-3">
      <form onSubmit={handleSearch} className="flex items-center gap-4">
        <button
          type="button"
          className="text-white cursor-pointer"
          onClick={onBackClick}
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 ">
            <Search className="h-5 w-5" />
          </div>

          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10 border-x-0 border-t-0 rounded-none border-b-2 border-white text-white  bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white focus-visible:border-white"
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform cursor-pointer -translate-y-1/2 text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
