export const PostsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="card bg-base-100 shadow-lg border border-base-200">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-base-300"></div>
                <div>
                  <div className="h-4 bg-base-300 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-base-300 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-base-300 rounded w-3/4 mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-base-300 rounded w-full"></div>
                <div className="h-4 bg-base-300 rounded w-5/6"></div>
                <div className="h-4 bg-base-300 rounded w-4/6"></div>
              </div>
              <div className="h-48 bg-base-300 rounded-lg mb-4"></div>
              <div className="flex gap-6">
                <div className="h-4 bg-base-300 rounded w-16"></div>
                <div className="h-4 bg-base-300 rounded w-20"></div>
                <div className="h-4 bg-base-300 rounded w-18"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
