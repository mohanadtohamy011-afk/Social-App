import { useState, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { ChevronDown, Globe, ImageIcon, Send, X } from "lucide-react";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import { createPost } from "../../Services/Post.service";
import { useUserContext } from "../../Context/UserContext";

type CreatePostProps = {
  getPosts: () => Promise<void>;
};

export default function CreatePost({ getPosts }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useUserContext();


  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  function handleClosePreview() {
    setImage(null);
    setImagePreview(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    if (!content.trim() && !image) {
      toast.error("Write something or choose an image before posting.");
      return;
    }

    const formData = new FormData();
    if (content.trim()) formData.append("body", content.trim());
    if (image) formData.append("image", image);

    setIsLoading(true);
    try {
      const { data } = await createPost(formData);
      toast.success(data.message ?? "Post created successfully.");
      setContent("");
      setImage(null);
      setImagePreview(null);
      await getPosts();
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(message ?? "Could not create your post.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="mx-auto mb-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5"
      onSubmit={handleSubmit}
    >
      <header className="mb-3 flex items-start gap-3">
        <div className="min-w-0 flex justify-center">
          <img
            alt={userDetails?.photo}
            className="size-11 shrink-0 rounded-full object-cover"
            src={userDetails?.photo}
          />
          <p className="text-sm font-bold text-gray-900 py-2">{userDetails?.name}</p>
        </div>
        <div>
           <label className="relative mt-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-2.5
pr-7 text-xs font-medium Otext-gray-600">
          <Globe size={12} aria-hidden="true" />

          <span className="sr-only">Post privacy</span>
          <select className="cursor-pointer appearance-none bg-transparent outline-none">
            <option value="only-me">Only me</option>
            <option value="public">Public</option>
          </ select>
          <ChevronDown
            size={12}
            aria-hidden="true"
            className="pointer-events-none absolute right-2"
          />
        </label>
        </div>
       
      </header>

      <textarea
        aria-label="Post text"
        onChange={(event) => setContent(event.target.value)}
        placeholder="What's on your mind?"
        rows={4}
        value={content}
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
            accept="image/*,video/*"
            className="sr-only"
            onChange={handleImageChange}
            type="file"
          />
        </label>
        <button
          disabled={isLoading || (!content.trim() && !image)}
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? <Spinner className="text-white" size="sm" /> : "Create Post"}
          {!isLoading && <Send size={14} />}
        </button>
      </div>
    </form>
  );
}
