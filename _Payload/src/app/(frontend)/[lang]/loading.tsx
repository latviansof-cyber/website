export default function Loading() {
  return (
    <>
      {/* SiteHeader skeleton */}
      <header className="sticky top-0 z-40 animate-pulse border-b border-white/10 bg-latvian-red shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-10 w-36 rounded-lg bg-white/20" />
          <div className="flex gap-4">
            <div className="h-6 w-20 rounded-full bg-white/20" />
            <div className="h-6 w-20 rounded-full bg-white/20" />
          </div>
        </div>
      </header>

      <main className="bg-cream text-ink">
        {/* Hero skeleton */}
        <section className="relative overflow-hidden bg-gradient-to-r from-sunset-peach/20 via-white to-sunset-gold/20 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="mx-auto h-12 w-3/4 animate-pulse rounded-xl bg-slate-200" />
              <div className="mx-auto h-5 w-2/3 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        </section>

        {/* Page cards skeleton */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mx-auto h-4 w-40 animate-pulse rounded-full bg-slate-200" />
              <div className="mx-auto mt-4 h-8 w-1/2 animate-pulse rounded-xl bg-slate-200" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-3xl bg-white/70 shadow-sm"
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer skeleton */}
      <footer className="animate-pulse bg-latvian-red py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto h-4 w-48 rounded-full bg-white/20" />
        </div>
      </footer>
    </>
  )
}
