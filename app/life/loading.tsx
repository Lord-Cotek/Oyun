import { PageSkeleton } from "@/components/ui/Skeleton";

/** Shown the instant a navigation starts, while this room is fetched. */
export default function Loading() {
  return <PageSkeleton shape="feed" />;
}
