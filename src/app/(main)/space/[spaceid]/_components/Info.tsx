import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
function Info() {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      Information about the board
    </div>
  );
}

export default Info;

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]">
      <Skeleton className="h-full w-full bg-muted-400" />
    </div>
  );
};
