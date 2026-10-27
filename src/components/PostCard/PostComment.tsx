import { useEffect, useState, type FormEvent } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { createPostComment } from "../../Services/comments.service";

function PostComment({
  postId,
  getComments,
}: {
  postId: string;
  getComments: (postId: string) => Promise<void> | void;
}) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim() && !image) {
      toast.error("Write a comment or choose an image.");
      return;
    }

    const formData = new FormData();
    if (content.trim()) formData.append("content", content.trim());
    if (image) formData.append("image", image);

    setIsSubmitting(true);
    try {
      const { data } = await createPostComment(postId, formData);
      toast.success(data.message ?? "Comment added.");
      setContent("");
      setImage(null);
      setImagePreview(null);
      await getComments(postId);
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(message ?? "Could not add your comment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  function clearImage() {
    setImage(null);
    setImagePreview(null);
  }

  return (
    <>
      <form className="mt-4 flex flex-col gap-2 pb-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2.5">
          <img
            alt="Your profile"
            className="size-8 shrink-0 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&h=96&q=80"
          />
          <div className="flex min-w-0 flex-1 items-center rounded-full bg-gray-100 pr-1.5 focus-within:ring-2 focus-within:ring-blue-200">
            <label className="sr-only" htmlFor={`post-comment-${postId}`}>
              Write a comment
            </label>
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500"
              id={`post-comment-${postId}`}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write a comment..."
              value={content}
            />
            <label className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100">
              <span className="sr-only">Add an image</span>
              <input
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
                type="file"
              />
              <ImagePlus size={16} />
            </label>
            <button
              aria-label="Post comment"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 disabled:text-gray-400 disabled:hover:bg-transparent"
              disabled={isSubmitting || (!content.trim() && !image)}
              type="submit"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        {imagePreview && (
          <div className="relative size-32">
            <button
              aria-label="Remove selected image"
              className="absolute right-1 top-1 rounded-full bg-white p-1"
              onClick={clearImage}
              type="button"
            >
              <X size={16} />
            </button>
            <img src={imagePreview} alt="Selected comment" className="size-32 object-cover" />
          </div>
        )}
      </form>
    </>
  );
}

export default PostComment;
