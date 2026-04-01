type SkeletonProps = {
  className?: string
}

const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 ${className}`} />
)

export default Skeleton
