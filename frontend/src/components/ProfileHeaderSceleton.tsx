export const ProfileHeaderSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-6 p-6 bg-base-100 rounded-2xl shadow-lg border border-base-200">
        <div className="avatar">
          <div className="w-24 h-24 rounded-full bg-base-300"></div>
        </div>
        <div className="flex-1">
          <div className="h-8 bg-base-300 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-base-300 rounded w-32 mb-3"></div>
          <div className="flex gap-6">
            <div className="h-4 bg-base-300 rounded w-20"></div>
            <div className="h-4 bg-base-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
