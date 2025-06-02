import React, { useState } from "react";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialQuery = "",
  className = ""
}) => {
  const [query, setQuery] = useState<string>(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon strokeWidth={1} className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-2 pl-12 pr-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Search movies..."
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
