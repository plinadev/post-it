import { useState, type ChangeEvent } from "react";
import { useAuthStore } from "../../state/user/useAuthStore";
import { useCreatePost } from "../../hooks/posts/useCreatePost";
import toast from "react-hot-toast";
import placeholder from "../../assets/placeholder.svg";
import { FaImage, FaPen, FaX } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";

function CreatePostPage() {
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { createPost, isCreating } = useCreatePost();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG and JPG files are allowed");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    setPhoto(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
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
    setTitle("");
    setContent("");
    setPhoto(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById(
      "photo-input"
    ) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      toast.error("Post must have a title and content");
      return;
    }
    createPost({ title, content, photoFile: photo });
  };

  const isFormDirty = title.trim() || content.trim() || photo;

  return (
    <div className="mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4  ">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img
            src={user?.avatarUrl ?? placeholder}
            alt="profile picture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 ">
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <p className="text-stone-600 flex items-center gap-2">
            <FaPen size={15} />
            create new post
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
            className="input input-bordered w-full h-12"
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
            className="textarea w-full resize-none h-50"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-stone-700">
              Add Image (Optional)
            </span>
            <span className="text-xs text-stone-500">Max 5MB</span>
          </label>

          {/* Image Preview */}
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
                className="absolute top-2 right-2 w-8 h-8 bg-accent text-white rounded-full hover:bg-stone-600 transition-colors flex items-center justify-center"
                title="Remove image"
              >
                <FaX size={10} />
              </button>
            </div>
          ) : (
            /* Upload Area */
            <div className="relative">
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
              />
              <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer">
                <FaImage size={40} className="text-stone-500" />

                <div className="text-center">
                  <p className="text-stone-600 font-medium mb-1">
                    Click to upload an image
                  </p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary flex-1  py-3 px-6  flex items-center justify-center gap-2"
            disabled={isCreating || !title.trim() || !content.trim()}
          >
            {isCreating ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <FaPen />
                Post
              </>
            )}
          </button>

          {isFormDirty && (
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-outline"
              disabled={isCreating}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Form Validation Hint */}
        {(!title.trim() || !content.trim()) && (
          <div className="bg-teal-50 border border-info rounded-lg p-4 flex items-start gap-3 text-info ">
            <FaInfoCircle size={20} className="self-center" />
            <span className="text-info">
              Please fill in both title and content to create your post.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePostPage;
