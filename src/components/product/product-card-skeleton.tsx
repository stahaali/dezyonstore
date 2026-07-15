import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton({
  layout = "grid",
  className,
}: {
  layout?: "grid" | "list";
  className?: string;
}) {
  if (layout === "list") {
    return (
      <div
        className={cn(
          "flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-3 sm:flex-row sm:items-center sm:gap-5 sm:p-4",
          className,
        )}
      >
        <Skeleton className="mx-auto h-[140px] w-full max-w-[180px] shrink-0 rounded-md sm:mx-0 sm:h-[120px] sm:w-[140px]" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-4 w-full max-w-md rounded" />
          <Skeleton className="h-4 w-3/4 max-w-sm rounded" />
          <Skeleton className="h-3 w-full max-w-lg rounded" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
        <Skeleton className="h-10 w-full rounded-full sm:w-[140px]" />
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <Skeleton className="h-[170px] w-full rounded-md sm:h-[190px] md:h-[200px]" />
      <div className="mt-3 flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="mt-1 h-5 w-16 rounded" />
        <Skeleton className="mt-auto h-10 w-full rounded-full" />
      </div>
    </div>
  );
}
