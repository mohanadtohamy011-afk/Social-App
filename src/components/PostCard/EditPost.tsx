import { useState, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { ImageIcon, Send, X } from "lucide-react";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import { updatePost } from "../../Services/Post.service";

type EditPostProps = {
  postId: string;
  initialContent: string;
  setshowEditPost: (show: boolean) => void;
  getPosts: () => Promise<void>;
};

export default function EditPost({
  postId,
  initialContent,
  setshowEditPost,
  getPosts,
}: EditPostProps) {
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  function handleClosePreview() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim() && !image) {
      toast.error("Add post text or choose an image before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("body", content.trim());
    if (image) formData.append("image", image);

    setIsLoading(true);
    try {
      const { data } = await updatePost(postId, formData);
      toast.success(data.message ?? "Post updated successfully.");
      await getPosts();
      setshowEditPost(false);
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(message ?? "Could not update your post.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5"
    >
      <textarea
        aria-label="Post text"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="What's on your mind?"
        rows={4}
        className="w-full resize-none rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200"
      />

      {imagePreview && (
        <div className="relative mt-3 overflow-hidden rounded-xl">
          <button
            type="button"
            aria-label="Remove image"
            onClick={handleClosePreview}
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/90 text-gray-700"
          >
            <X size={16} />
          </button>
          <img
            src={imagePreview}
            alt="Selected post image"
            className="max-h-64 w-full object-cover"
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
        <label className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900">
          <ImageIcon size={18} className="text-emerald-500" />
          {image?.name ?? "Photo/video"}
          <input
            onChange={handleImageChange}
            accept="image/*,video/*"
            className="sr-only"
            type="file"
          />
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setshowEditPost(false)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            disabled={isLoading || (!content.trim() && !image)}
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLoading ? <Spinner className="text-white" size="sm" /> : "Edit Post"}
            {!isLoading && <Send size={14} />}
          </button>
        </div>
      </div>
    </form>
  );
}
