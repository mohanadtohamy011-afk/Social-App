
export default function Authintro() {
  return (
    <>
        <section className="min-h-screen  px-5 py-16 flex items-center justify-center">
      <div className="w-full max-w-2xl">

        <div className="mb-6 ">
          <h1 className="text-main text-4xl font-bold md:text-5xl">
            Arghy
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-gray-700 md:text-lg">
            Connect with friends and the world around you on Arghy.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md md:p-6">

          <p className="text-main text-xs font-bold uppercase tracking-[2px]">
            About Arghy
          </p>

          <h2 className="mt-2 text-lg font-bold text-gray-900 md:text-xl">
            A Social Space Built for Real Connections
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Arghy is a social media platform where you can connect with
            friends, share your thoughts and moments, discover interesting
            content, and be part of a growing online community.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">

            <div className="rounded-xl border border-gray-200 bg-sec p-3">
              <h3 className="text-main text-lg font-bold">
                10K+
              </h3>

              <p className="text-[11px] font-semibold uppercase text-gray-600">
                Active Users
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-sec p-3">
              <h3 className="text-main text-lg font-bold">
                50K+
              </h3>

              <p className="text-[11px] font-semibold uppercase text-gray-600">
                Posts
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-sec p-3">
              <h3 className="text-main text-lg font-bold">
                100K+
              </h3>

              <p className="text-[11px] font-semibold uppercase text-gray-600">
                Connections
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-sec p-3">
              <h3 className="text-main text-lg font-bold">
                24/7
              </h3>

              <p className="text-[11px] font-semibold uppercase text-gray-600">
                Community
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-sec p-3">
              <h3 className="text-main text-lg font-bold">
                100%
              </h3>

              <p className="text-[11px] font-semibold uppercase text-gray-600">
                Social
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
    </>
  )
}
