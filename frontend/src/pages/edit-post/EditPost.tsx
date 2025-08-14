import { useState, useEffect, type ChangeEvent } from "react";
import { useAuthStore } from "../../state/user/useAuthStore";
import { usePost } from "../../hooks/posts/usePost";
import toast from "react-hot-toast";
import placeholder from "../../assets/placeholder.svg";
import { FaImages, FaPen, FaX } from "react-icons/fa6";
import { PostsSkeleton } from "../../components/PostsSkeleton";
import { FaInfoCircle, FaSadTear } from "react-icons/fa";
import { useEditPost } from "../../hooks/posts/useEditPost";

function EditPostPage() {
  const user = useAuthStore((state) => state.user);
  const { post, isFetching } = usePost();
  const { editPost, isUpdating } = useEditPost();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Populate form fields when post loads
  useEffect(() => {
    if (post?.data) {
      setTitle(post.data.title);
      setContent(post.data.content);
      setImagePreview(post.data.photoUrl || null);
      setPhoto(null);
    }
  }, [post]);

  if (isFetching) return <PostsSkeleton />;

  if (!post?.data || post.data.authorId !== user?.uid) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
            <FaSadTear className="text-base-content/40" size={25} />
          </div>
          <h3 className="text-2xl font-semibold text-base-content mb-3">
            Post not found
          </h3>
          <p className="text-base-content/60 text-lg">
            Post does not exist or you don't have permission to edit it!
          </p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG and JPG files are allowed");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    setPhoto(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPhoto(null);
    setImagePreview(null);
    const fileInput = document.getElementById(
      "photo-input"
    ) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  const resetForm = () => {
    if (post?.data) {
      setTitle(post.data.title);
      setContent(post.data.content);
      setImagePreview(post.data.photoUrl || null);
      setPhoto(null);
      const fileInput = document.getElementById(
        "photo-input"
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    }
  };

  const handleSubmit = () => {
    if (!user || !post?.data) return;
    if (!title.trim() || !content.trim()) {
      toast.error("Post must have a title and content");
      return;
    }

    editPost({
      id: post.data.id,
      title,
      content,
      photoFile: photo,
      removePhoto: !photo && !imagePreview,
    });
    console.log({
      id: post.data.id,
      title,
      content,
      photoFile: photo,
      removePhoto: !photo && !imagePreview,
    });
  };

  const isFormDirty =
    title !== post?.data.title || content !== post?.data.content || photo;

  return (
    <div className="mx-auto p-6 min-h-screen max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img
            src={user?.avatarUrl ?? placeholder}
            alt="profile picture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <p className="text-stone-600 flex items-center gap-2">
            <FaPen size={15} />
            edit post
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6 mt-6">
        {/* Title Input */}
        <div>
          <label className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-stone-700">
              Title <span className="text-error">*</span>
            </span>
            <span className="text-xs text-stone-500">{title.length}/100</span>
          </label>
          <input
            type="text"
            placeholder="Give your post a catchy title..."
            className="input border-none w-full h-12"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-stone-700">
              Content <span className="text-error">*</span>
            </span>
            <span className="text-xs text-stone-500">
              {content.length}/1000
            </span>
          </label>
          <textarea
            placeholder="What's on your mind? Share your thoughts..."
            className="textarea border-none w-full resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-stone-700">
              Add Image
            </span>
            <span className="text-xs text-stone-500">Max 10MB</span>
          </label>

          {imagePreview ? (
            <div className="relative mb-4">
              <div className="rounded-lg overflow-hidden border-2 border-stone-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-accent text-white rounded-full hover:bg-stone-600 flex items-center justify-center"
                title="Remove image"
              >
                <FaX size={10} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <label htmlFor="photo-input" className="cursor-pointer">
                <FaImages size={20} className="text-stone-600" />
              </label>
              <input
                id="photo-input"
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary flex-1 py-3 px-6 flex items-center justify-center gap-2"
            disabled={isUpdating || !title.trim() || !content.trim()}
          >
            {isUpdating ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <FaPen />
                Save Changes
              </>
            )}
          </button>

          {isFormDirty && (
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-outline"
              disabled={isUpdating}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Form Validation Hint */}
        {(!title.trim() || !content.trim()) && (
          <div className="bg-teal-50 border border-info rounded-lg p-4 flex items-start gap-3 text-info">
            <FaInfoCircle size={20} className="self-center" />
            <span className="text-info">
              Please fill in both title and content to update your post.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditPostPage;
