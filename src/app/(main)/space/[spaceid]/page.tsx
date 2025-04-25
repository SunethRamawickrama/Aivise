import React from "react";
import Canvas from "@/app/(main)/space/[spaceid]/_components/Canvas";

export default async function SingleSpacePage({ params }: { params: { spaceid: string } }) {
  const { spaceid } = params;

  return (
  <>
    <Canvas spaceId={spaceid} />
  </>
  )
}
