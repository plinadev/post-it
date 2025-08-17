import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { useSuggestions } from "../hooks/posts/useSuggestions";
import { parseHighlightedText } from "../utils/parseHighlightedTest";
import Loader from "./Loader";
import { SearchSuggestionsSkeleton } from "./SearchSuggestionsSkeleton";

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [inputValue, setInputValue] = useState(search);
  const [isOpen, setIsOpen] = useState(false);

  const { suggestions, isFetching, error } = useSuggestions();

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync input value with query param
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(!!value);
    setSearchParams(value ? { search: value } : {});
  };

  const handleFocus = () => {
    if (inputValue) setIsOpen(true);
  };

  // Helper to strip <bold> tags
  const stripTags = (text: string) => text.replace(/<\/?bold>/g, "");

  return (
    <div className="relative w-full " ref={containerRef}>
      <div className="flex px-4 py-3 rounded-lg border border-base-300 overflow-hidden items-center gap-3">
        <FaSearch className="text-stone-300" />
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full outline-none text-md"
        />
      </div>

      {/* Suggestions dropdown */}
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isFetching && <SearchSuggestionsSkeleton />}

          {error && (
            <li className="p-3 text-center text-error">
              Error fetching suggestions
            </li>
          )}

          {!isFetching && !error && suggestions.length === 0 && (
            <li className="p-3 text-center text-gray-400">No suggestions</li>
          )}

          {!isFetching &&
            !error &&
            suggestions.map((sug) => (
              <li
                key={sug.id}
                className="px-4 py-2 hover:bg-base-200 cursor-pointer"
                onClick={() => {
                  const cleanTitle = stripTags(sug.title);
                  setInputValue(cleanTitle);
                  setSearchParams({ search: cleanTitle });
                  setIsOpen(false);
                }}
              >
                <div className="font-medium">
                  {parseHighlightedText(sug.title)}
                </div>
                <div className="text-sm text-gray-500">
                  {parseHighlightedText(sug.snippet)}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
