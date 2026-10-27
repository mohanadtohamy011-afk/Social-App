import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Globe2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { getSinglePost } from "../../Services/Post.service";
import type { PostCardI, TopComment } from "../../types/postCard.types";
import { getPostComments } from "../../Services/comments.service";
import PostComment from "../../components/PostCard/PostComment";
import CommentItem from "../../components/PostCard/CommentItem";
import { useUserContext } from "../../Context/UserContext";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

function PostDetails() {
  const [details, setDetails] = useState<PostCardI | null>(null)
  const [allComments, setAllComments] = useState<TopComment[] | []>([])
  const [visibleComments, setVisibleComments] = useState(2)
  const [liked, setLiked] = useState(false);
  const [likeDelta, setLikeDelta] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const { id } = useParams();
  const { userDetails } = useUserContext();


  function toggleLike() {
    setLiked((currentLiked) => {
      setLikeDelta((currentLikes) => currentLikes + (currentLiked ? -1 : 1));
      return !currentLiked;
    });
  }


  async function getPostDetails(postId: string): Promise<PostCardI> {
    const { data } = await getSinglePost(postId);
    const postDetails = data?.data?.post ?? data?.data?.Post ?? data?.post ?? data?.Post;
    if (!postDetails) throw new Error("The post response did not include a post.");
    return postDetails;
  }

  async function getComments(postId: string): Promise<TopComment[]> {
    const { data } = await getPostComments(postId);
    const comments =
      data?.data?.comments ?? data?.data?.Comments ?? data?.comments ?? data?.Comments;
    if (!Array.isArray(comments)) {
      throw new Error("The comments response did not include a comments list.");
    }
    return comments;
  }

  async function refreshComments(postId: string) {
    const comments = await getComments(postId);
    setAllComments(comments);
    setCommentsLoaded(true);
    setDetails((currentDetails) =>
      currentDetails
        ? { ...currentDetails, commentsCount: comments.length }
        : currentDetails,
    );
  }

  useEffect(() => {
    if (!id) return;
    let isActive = true;

    getPostDetails(id)
      .then((postDetails) => {
        if (!isActive) return;
        setDetails(postDetails);
        setLikeDelta(0);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : error instanceof Error
            ? error.message
            : undefined;
        toast.error(message ?? "Could not load this post.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    getComments(id)
      .then((comments) => {
        if (!isActive) return;
        setAllComments(comments);
        setCommentsLoaded(true);
        setDetails((currentDetails) =>
          currentDetails
            ? { ...currentDetails, commentsCount: comments.length }
            : currentDetails,
        );
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
  }, [id])


  async function sharePost() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Link copied");
    } catch {
      setShareMessage("Could not share this post");
    }
  }

  function handleMoreComments(){
    setVisibleComments((count) => count + 1)
  }


  return (
    <>
      {isLoading && <p className="mx-auto mt-8 max-w-2xl text-center text-gray-600">Loading post...</p>}
      {!isLoading && !details && (
        <p className="mx-auto mt-8 max-w-2xl text-center text-gray-600">
          This post could not be found.
        </p>
      )}
      {details &&
        <>

          <div className="mx-auto mt-6 w-full  px-4 sm:px-5">
            <Link
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              to="/feed"
            >
              <ArrowLeft aria-hidden="true" size={17} />
              Back to feed
            </Link>
          </div>
          <article className="mx-auto mb-6 mt-2 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <header className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white"
                  src={details?.user.photo}
                  alt={details.user.name}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="truncate text-sm font-semibold text-gray-900">
                      {details.user.name}
                    </span>
                    <span className="truncate text-xs text-gray-500">
                      {details.user.username}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                    <span>
                      {new Date(details.createdAt).toLocaleString("en-us", {
                        timeStyle: "short",
                        dateStyle: "full",
                      })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <Globe2 aria-label="Public" size={13} />
                    <span>{details.privacy}</span>
                  </div>
                </div>
              </div>
              <button
                aria-label="More post options"
                className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                type="button"
              >
                <MoreHorizontal size={21} />
              </button>
            </header>

            <div className="px-4 pb-3 pt-3 text-sm leading-6 text-gray-800 sm:px-5">
              <p>{details.body}</p>
            </div>

            {details.image && (
              <img
                className="block max-h-[520px] w-full bg-gray-100 object-cover"
                src={details.image}
                alt={details.body}
              />
            )}

            <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-gray-500 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="flex size-[18px] items-center justify-center rounded-full bg-rose-500 text-white">
                  <Heart aria-hidden="true" fill="currentColor" size={11} />
                </span>
                <span>{details.likesCount + likeDelta} likes</span>
              </div>
              <div className="flex gap-3">
                <span>{details.commentsCount} comments</span>
                <span>{details.sharesCount} shares</span>
              </div>
            </div>

            <div className="mx-4 flex border-y border-gray-200 sm:mx-5">
              <button
                aria-pressed={liked}
                className={`flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium transition hover:bg-gray-50 ${liked ? "text-blue-700" : "text-gray-600"}`}
                onClick={toggleLike}
                type="button"
              >
                <Heart fill={liked ? "currentColor" : "none"} size={18} />
                Like
              </button>
              <button
                className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                onClick={() => document.getElementById("post-details-comment")?.focus()}
                type="button"
              >
                <MessageCircle size={18} />
                Comment
              </button>
              <button
                className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                onClick={sharePost}
                type="button"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
            {shareMessage && (
              <p aria-live="polite" className="px-5 pt-2 text-xs text-gray-500">
                {shareMessage}
              </p>
            )}

            <section aria-label="Comments" className="px-4 pb-4 pt-3 sm:px-5">
              <button
                className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900"
                type="button"
                onClick={handleMoreComments}
              >
                Show more comments
                <ChevronDown size={16} />
              </button>

              {allComments.length > 0 ? (
                allComments.slice(0, visibleComments).map((comment) => (
                  <CommentItem
                    comment={comment}
                    key={comment._id}
                    onCommentsChanged={() => refreshComments(details._id)}
                  />
                ))
              ) : (
                !commentsLoaded &&
                details.topComment && (
                  <CommentItem
                    comment={details.topComment}
                    onCommentsChanged={() => refreshComments(details._id)}
                  />
                )
              )}

              {userDetails && (
                <PostComment postId={details._id} getComments={async (postId) => refreshComments(postId)} />
              )}
            </section>
          </article>
        </>}
    </>
  );
}

export default PostDetails;
