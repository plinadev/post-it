export const CommentsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex gap-3 p-6 flex-col items-start">
        <div className="flex-1 flex flex-row gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full bg-base-300"></div>
          </div>
          <div>
            <div className="h-3 bg-base-300 rounded w-32 mb-3"></div>
            <div className="h-10 bg-base-300 rounded-lg w-80 mb-2"></div>
          </div>
        </div>

        <div className="flex-1 flex flex-row gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full bg-base-300"></div>
          </div>
          <div>
            <div className="h-3 bg-base-300 rounded w-32 mb-3"></div>
            <div className="h-10 bg-base-300 rounded-lg w-80 mb-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
