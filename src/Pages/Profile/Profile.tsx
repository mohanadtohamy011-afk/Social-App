import { useState } from "react";
import { Bookmark, ImageIcon, Mail, Sparkles } from "lucide-react";
import { useUserContext } from "../../Context/UserContext";

// const profile = {
//   name: "yasmin lotfy",
//   username: "@yasmin_lotfy11",
//   email: "yasmin.lotfy11@gmail.com",
//   photo:
//     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
//   followers: 1,
//   following: 1,
//   bookmarks: 0,
//   myPosts: 0,
//   savedPosts: 0,
// };



function Profile() {
  const [activeTab, setActiveTab] = useState("posts");

  const { userDetails, isLoading, error } = useUserContext();

  return (
    <>
    {isLoading && (
      <p className="mx-auto mt-8 max-w-6xl px-4 text-center text-gray-600">
        Loading profile...
      </p>
    )}
    {error && (
      <p role="alert" className="mx-auto mt-8 max-w-6xl px-4 text-center text-red-600">
        {error}
      </p>
    )}
    {!isLoading && !error && !userDetails && (
      <p className="mx-auto mt-8 max-w-6xl px-4 text-center text-gray-600">
        Profile is unavailable.
      </p>
    )}
    {userDetails && <>
    <main className="min-h-screen bg-sec py-6">
      <div className="container mx-auto max-w-6xl px-4">
        <section className="relative">
          <div className="h-36 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-700 sm:h-44" />

          <div className="relative mx-2 -mt-16 rounded-3xl bg-white p-5 shadow-sm sm:mx-4 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={userDetails.photo}
                  alt={userDetails.name}
                  className="size-24 shrink-0 rounded-full object-cover ring-4 ring-white sm:size-28"
                />
                <div>
                  <h1 className="text-2xl font-bold capitalize text-gray-900">
                    {userDetails.name}
                  </h1>
                  <p className="text-sm text-gray-500">{userDetails.username}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    <Sparkles size={12} />
                    Route Posts member
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 lg:min-w-80">
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Followers
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {userDetails.followersCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Following
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {userDetails.followingCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Bookmarks
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {userDetails.bookmarksCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h2 className="text-sm font-semibold text-gray-900">About</h2>
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  {userDetails.email}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles size={16} className="text-gray-400" />
                  Active on Route Posts
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    My Posts
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {/* {userDetails.myPosts} */}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Saved Posts
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {/* {userDetails.savedPosts} */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                activeTab === "posts"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <ImageIcon size={16} />
              My Posts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                activeTab === "saved"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <Bookmark size={16} />
              Saved
            </button>
          </div>
          <span className="grid size-7 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
            {/* {activeTab === "posts" ? userDetails.myPosts : userDetails.savedPosts} */}
          </span>
        </section>

        <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
          {activeTab === "posts"
            ? "You have not posted yet."
            : "You have no saved posts."}
        </p>
      </div>
    </main>
    </>}
    </>
  );
}

export default Profile;
