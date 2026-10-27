import { useEffect, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { AlertDialog, Button, Dropdown, Label } from "@heroui/react";
import { MoreHorizontal, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useUserContext } from "../../Context/UserContext";
import {
  deletePostComment,
  updatePostComment,
} from "../../Services/comments.service";
import type { TopComment } from "../../types/postCard.types";

type CommentItemProps = {
  comment: TopComment;
  onCommentsChanged: () => Promise<void> | void;
};

export default function CommentItem({
  comment,
  onCommentsChanged,
}: CommentItemProps) {
  const { userDetails } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = userDetails?._id === comment.commentCreator._id;

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function closeEditor() {
    setIsEditing(false);
    setContent(comment.content);
    setImage(null);
    setImagePreview(null);
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim() && !image && !comment.image) {
      toast.error("Add comment text or choose an image before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content.trim());
    if (image) formData.append("image", image);

    setIsSaving(true);
    try {
      const { data } = await updatePostComment(comment.post, comment._id, formData);
      toast.success(data.message ?? "Comment updated successfully.");
      setIsEditing(false);
      setImage(null);
      setImagePreview(null);
      try {
        await onCommentsChanged();
      } catch {
        toast.error("Comment updated, but the comments could not be refreshed.");
      }
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(message ?? "Could not update this comment.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const { data } = await deletePostComment(comment.post, comment._id);
      toast.success(data.message ?? "Comment deleted successfully.");
      setIsDeleteDialogOpen(false);
      try {
        await onCommentsChanged();
      } catch {
        toast.error("Comment deleted, but the comments could not be refreshed.");
      }
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(message ?? "Could not delete this comment.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="my-3 flex items-start justify-between gap-2.5">
      <div className="flex min-w-0 items-start gap-2.5">
        <img
          alt={comment.commentCreator.name}
          className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
          src={comment.commentCreator.photo}
        />
        <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-xs font-semibold text-gray-900">
              {comment.commentCreator.name}
            </span>
            <span className="text-[11px] text-gray-500">
              {comment.commentCreator.username}
            </span>
          </div>
          {isEditing ? (
            <form className="mt-2 space-y-2" onSubmit={handleEdit}>
              <textarea
                aria-label="Edit comment"
                className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm"
                onChange={(event) => setContent(event.target.value)}
                value={content}
                rows={3}
              />
              {imagePreview && (
                <div className="relative w-fit">
                  <img
                    className="size-20 rounded object-cover"
                    src={imagePreview}
                    alt="Selected comment image"
                  />
                  <button
                    aria-label="Remove selected image"
                    className="absolute -right-2 -top-2 rounded-full bg-white p-1"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer text-xs font-medium text-blue-700">
                  Change image
                  <input
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setImage(file);
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                    type="file"
                  />
                </label>
                <button
                  className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                  onClick={closeEditor}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Saving..." : "Save"}
                  {!isSaving && <Send size={12} />}
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="mt-0.5 break-words text-sm leading-5 text-gray-800">
                {comment.content}
              </p>
              {comment.image && (
                <img
                  src={comment.image}
                  className="mt-2 size-20 object-cover"
                  alt="Comment attachment"
                />
              )}
            </>
          )}
          <span className="mt-1 block text-[11px] text-gray-500">
            {new Date(comment.createdAt).toLocaleString("en-us", {
              timeStyle: "short",
              dateStyle: "full",
            })}
          </span>
        </div>
      </div>

      {isOwner && !isEditing && (
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <Dropdown>
            <Button aria-label="Comment options" variant="ghost">
              <MoreHorizontal size={18} />
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu>
                <Dropdown.Item
                  id="edit-comment"
                  textValue="Edit comment"
                  onAction={() => setIsEditing(true)}
                >
                  <Label>Edit Comment</Label>
                </Dropdown.Item>
                <Dropdown.Item
                  id="delete-comment"
                  textValue="Delete comment"
                  variant="danger"
                  onAction={() => setIsDeleteDialogOpen(true)}
                >
                  <Label>Delete Comment</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="sm:max-w-[400px]">
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>Delete this comment?</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p>This comment will be permanently deleted. This cannot be undone.</p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button
                    slot="close"
                    variant="tertiary"
                    isDisabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    isDisabled={isDeleting}
                    onPress={() => void handleDelete()}
                  >
                    {isDeleting ? "Deleting..." : "Delete Comment"}
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      )}
    </div>
  );
}
