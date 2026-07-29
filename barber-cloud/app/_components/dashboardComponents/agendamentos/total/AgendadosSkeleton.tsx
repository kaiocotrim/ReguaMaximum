// app/_components/dashboardComponents/agendamentos/total/AgendadosSkeleton.tsx
export default function AgendadosSkeleton() {
  return (
    <div className="relative rounded-3xl p-4 md:p-8 bg-gradient-to-b dark:from-zinc-950 dark:via-black dark:to-zinc-950 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C3F32C]/5 blur-3xl" />

      <div className="relative mb-6 space-y-2">
        <div className="h-5 w-40 rounded-md dakr:bg-zinc-800/60 animate-pulse" />
        <div className="h-4 w-56 rounded-md dark:bg-zinc-800/40 animate-pulse" />
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border dark:border-zinc-800/80 dark:bg-zinc-950/60 p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full dark:bg-zinc-800/60 animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-2/3 rounded dark:bg-zinc-800/60 animate-pulse" />
                <div className="h-3 w-1/3 rounded dark:bg-zinc-800/40 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-1/2 rounded dark:bg-zinc-800/40 animate-pulse" />
              <div className="h-3 w-2/5 rounded dark:bg-zinc-800/40 animate-pulse" />
              <div className="h-3 w-1/3 rounded dark:bg-zinc-800/40 animate-pulse" />
            </div>
            <div className="h-8 w-full rounded-lg dark:bg-zinc-800/30 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}