import ProfileTable from "@/components/tables/artifacts/view";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Page() {
  // const badges = await db.badge.findMany();

  return (
    <div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <Skeleton />
          </div>
        }
      >
        <ProfileTable />
      </Suspense>
    </div>
  );
}
