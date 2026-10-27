import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { PostCardI } from "../../types/postCard.types";
import { getUserFeed } from "../../Services/Feed.services";
import CreatePost from "../../components/PostCard/CreatePost";
import PostCard from "../../components/PostCard/PostCard";
import PostSkeleton from "../../components/PostCard/PostSkeleton";
import Sidebar from "../../components/Sidebar/Sidebar";
import SuggestedFriends from "../../components/Suggestedfriends/SuggestedFriends";

async function fetchPosts(): Promise<PostCardI[]> {
  const { data } = await getUserFeed();
  const feedPosts =
    data?.data?.posts ?? data?.data?.Posts ?? data?.posts ?? data?.Posts;

  if (!Array.isArray(feedPosts)) {
    throw new Error("The feed response did not include a posts list.");
  }

  return feedPosts;
}

export default function Newsfeed() {
  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      setPosts(await fetchPosts());
    } catch (error) {
      setHasError(true);
      toast.error(error instanceof Error ? error.message : "Could not load the feed.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    fetchPosts()
      .then((feedPosts) => {
        if (isActive) setPosts(feedPosts);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setHasError(true);
        toast.error(error instanceof Error ? error.message : "Could not load the feed.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-20">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-7">
          <CreatePost getPosts={loadPosts} />
          {isLoading ? (
            <PostSkeleton />
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} getPosts={loadPosts} />
            ))
          )}
          {!isLoading && hasError && (
            <div className="rounded-xl bg-white p-5 text-center text-sm text-gray-600">
              Could not load posts.{" "}
              <button
                className="font-semibold text-main"
                onClick={() => void loadPosts()}
                type="button"
              >
                Try again
              </button>
            </div>
          )}
          {!isLoading && !hasError && posts.length === 0 && (
            <p className="rounded-xl bg-white p-5 text-center text-sm text-gray-600">
              No posts to show yet.
            </p>
          )}
        </div>
        <div className="col-span-3">
          <SuggestedFriends />
        </div>
      </div>
    </div>
  );
}
