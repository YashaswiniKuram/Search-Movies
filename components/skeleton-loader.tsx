import { cn } from "@/lib/utils"

interface SkeletonLoaderProps {
  className?: string
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-muted rounded-lg aspect-[2/3] mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  )
}
