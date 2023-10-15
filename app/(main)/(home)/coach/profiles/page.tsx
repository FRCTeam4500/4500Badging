import ProfileTable from "@/components/tables/artifacts/view";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Page() {
    const profileTable: JSX.Element = await ProfileTable()
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <Skeleton />
          </div>
        }
      >
        {profileTable}
      </Suspense>
    </div>
  );
}
