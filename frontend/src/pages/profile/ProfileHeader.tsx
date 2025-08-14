import { BsChatSquareHeartFill } from "react-icons/bs";
import placeholder from "../../assets/placeholder.svg";

export const ProfileHeader = ({
  user,
  postsCount,
}: {
  user: { avatarUrl: string | null; username: string } | undefined;
  postsCount: number;
}) => {
  return (
    <div className=" rounded-2xl p-6 border border-base-200 mb-8">
      <div className="flex items-center gap-6">
        <div className="avatar">
          <div className="w-24 h-24 rounded-full ring  ring-stone-300 ring-offset-2">
            <img
              src={user?.avatarUrl || placeholder}
              alt="Profile picture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-base-content mb-2">
            {user?.username}
          </h1>
          <div className="flex items-center gap-6 text-base-content/70">
            <div className="stat-desc flex items-center gap-2">
              <BsChatSquareHeartFill size={16} />
              <span className="font-medium">
                {postsCount} {postsCount === 1 ? "Post" : "Posts"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
