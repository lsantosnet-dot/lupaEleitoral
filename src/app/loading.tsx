import { SkeletonCard } from "@/components/ui/SkeletonCard"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto pb-24 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <section className="space-y-4 pt-4">
        <Skeleton className="h-8 w-[180px] rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </section>

      {/* Cards Skeleton List */}
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
