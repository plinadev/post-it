export const SearchSuggestionsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex gap-3 p-6 flex-col items-start">
        <div className="flex-1">
          <div className="h-5 bg-base-300 rounded-lg w-48 mb-2"></div>
          <div className="h-3 bg-base-300 rounded w-32 mb-3"></div>
        </div>
        <div className="flex-1">
          <div className="h-5 bg-base-300 rounded-lg w-48 mb-2"></div>
          <div className="h-3 bg-base-300 rounded w-32 mb-3"></div>
        </div>
      </div>
    </div>
  );
};
