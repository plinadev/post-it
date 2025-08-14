import { FaPen } from "react-icons/fa6";

export const EmptyPosts = ({ username }: { username: string }) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
          <FaPen className="text-base-content/40" size={25} />
        </div>
        <h3 className="text-2xl font-semibold text-base-content mb-3">
          No posts yet
        </h3>
        <p className="text-base-content/60 text-lg">
          {username} hasn't shared anything yet
        </p>
        <p className="text-base-content/60 text-lg">Check back later!</p>
      </div>
    </div>
  );
};
