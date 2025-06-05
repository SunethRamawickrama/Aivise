import React from "react";
import Canvas from "@/app/(main)/space/[spaceid]/_components/Canvas";
import Navbar from "@/components/Navbar";

export default async function SingleSpacePage({
  params,
}: {
  params: { spaceid: string };
}) {
  const { spaceid } = params;

  return (
    <>
      <Navbar></Navbar>
      <Canvas spaceId={spaceid} />
    </>
  );
}
