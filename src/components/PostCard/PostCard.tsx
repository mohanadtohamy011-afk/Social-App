import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import {
  ChevronDown,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import type { PostCardI, TopComment } from "../../types/postCard.types";
import { getPostComments } from "../../Services/comments.service";
import PostComment from "./PostComment";
import { Button, Dropdown, Label } from "@heroui/react";
import { useUserContext } from "../../Context/UserContext";
import EditPost from "./EditPost";
import { AlertDialog } from "@heroui/react";
import { deletePost } from "../../Services/Post.service";
import CommentItem from "./CommentItem";

async function fetchComments(postId: string): Promise<TopComment[]> {
  const { data } = await getPostComments(postId);
  const comments =
    data?.data?.comments ?? data?.data?.Comments ?? data?.comments ?? data?.Comments;
  if (!Array.isArray(comments)) {
    throw new Error("The comments response did not include a comments list.");
  }
  return comments;
}

export default function PostCard({
  post,
  getPosts,
}: {
  post: PostCardI;
  getPosts: () => Promise<void>;
}) {
  const [allComments, setAllComments] = useState<TopComment[]>([]);
  const [visibleComments, setVisibleComments] = useState(2);
  const { userDetails } = useUserContext();
  const [showEditPost, setshowEditPost] = useState<boolean>(false);
  const [showDeletDialouge, setshowDeletDialouge] = useState<boolean>(false);


  async function getComments(postId: string) {
    try {
      setAllComments(await fetchComments(postId));
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(message ?? "Could not load comments.");
    }
  }

  useEffect(() => {
    let isActive = true;
    fetchComments(post._id)
      .then((comments) => {
        if (isActive) setAllComments(comments);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : error instanceof Error
            ? error.message
            : undefined;
        toast.error(message ?? "Could not load comments.");
      });

    return () => {
      isActive = false;
    };
  }, [post._id]);

  async function deletMyPost(postId: string) {
    try {
      const { data } = await deletePost(postId);
      toast.success(data.message ?? "Post deleted successfully.");
      setshowDeletDialouge(false);
      getPosts();
    } catch (error) {
      console.log(error);

    }
  }

  return (
    <article className="mx-auto my-3 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white"
            src={post.user.photo}
            alt={post.user.name}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="truncate text-sm font-semibold text-gray-900">
                {post.user.name}
              </span>
              <span className="truncate text-xs text-gray-500">{post.user.username}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
              <span>
                {new Date(post.createdAt).toLocaleString("en-us", {
                  timeStyle: "short",
                  dateStyle: "full",
                })}
              </span>
              <span aria-hidden="true">·</span>
              <span>{post.privacy}</span>
            </div>
          </div>
        </div>
        <button
          aria-label="More post options"
          className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          type="button"
        >

          {post.user._id === userDetails?._id ? <>
            <Dropdown>
              <Button aria-label="Menu" variant="ghost">
                <MoreHorizontal size={20} />
              </ Button>
              <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>

                  <Dropdown.Item id="Save-Post" textValue="Save Post">
                    <Label>Save Post</Label>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setshowEditPost(true)} id="edit-Post" textValue="Edit Post">
                    <Label>Edit Post</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="delete-Post" textValue="Delete Post" variant="danger" onClick={() => setshowDeletDialouge(true)}>
                    <Label>Delete Post</Label>
                  </Dropdown.Item>
                </ Dropdown.Menu>
              </Dropdown.Popover>
            </ Dropdown>
          </> : <>
            <Dropdown>
              <Button aria-label="Menu" variant="ghost">
                <MoreHorizontal size={20} />
              </ Button>
              <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>

                  <Dropdown.Item id="Save-Post" textValue="Save Post">
                    <Label>Save Post</Label>
                  </Dropdown.Item>
                </ Dropdown.Menu>
              </Dropdown.Popover>
            </ Dropdown>
          </>}



        </button>
      </header>

      <AlertDialog isOpen={showDeletDialouge}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Delete Post permanently?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>
                  This will permanently delete <strong>My Awesome Project</strong> and all of its
                  data. This action cannot be undone.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button onClick={() => setshowDeletDialouge(false)} slot="close" variant="tertiary">
                  Cancel
                </Button>
                <Button slot="close" variant="danger" onClick={() => deletMyPost(post._id)}>
                  Delete Post
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>

      {showEditPost ? (
        <EditPost
          getPosts={getPosts}
          initialContent={post.body}
          postId={post._id}
          setshowEditPost={setshowEditPost}
        />
      ) : <>
        <div className="px-4 pb-3 pt-3 text-sm leading-6 text-gray-800 sm:px-5">
          <p>{post.body}</p>
        </div>

        {post.image && (
          <img
            className="block max-h-[520px] w-full bg-gray-100 object-cover"
            src={post.image}
            alt={post.body || "Post image"}
          />
        )}
      </>}




      <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-gray-500 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex size-[18px] items-center justify-center rounded-full bg-rose-500 text-white">
            <Heart aria-hidden="true" fill="currentColor" size={11} />
          </span>
          <span>{post.likesCount} likes</span>
        </div>
        <div className="flex gap-3">
          <span>{post.commentsCount} comments</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      <div className="mx-4 flex items-center border-y border-gray-200 sm:mx-5">
        <button
          className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          type="button"
        >
          <Heart size={18} />
          Like
        </button>
        <button
          className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          onClick={() => document.getElementById(`post-comment-${post._id}`)?.focus()}
          type="button"
        >
          <MessageCircle size={18} />
          Comment
        </button>
        <button
          className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `${window.location.origin}/postDetails/${post._id}`,
              );
              toast.success("Post link copied.");
            } catch {
              toast.error("Could not copy the post link.");
            }
          }}
          type="button"
        >
          <Share2 size={18} />
          Share
        </button>
        <Link className="px-2 text-sm text-main" to={`/postDetails/${post._id}`}>
          View Details
        </Link>
      </div>

      <section aria-label="Comments" className="px-4 pb-4 pt-3 sm:px-5">
        {allComments.length > visibleComments && (
          <button
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900"
            onClick={() => setVisibleComments((count) => count + 1)}
            type="button"
          >
            Show more comments
            <ChevronDown size={16} />
          </button>
        )}

        {allComments.slice(0, visibleComments).map((comment) => (
          <CommentItem
            comment={comment}
            key={comment._id}
            onCommentsChanged={() => getComments(post._id)}
          />
        ))}

        <PostComment postId={post._id} getComments={getComments} />
      </section>
    </article>
  );
}
