import React from "react";
import Info from "./Info";
import Toolbar from "./Toolbar";

interface CanvasProps {
  spaceId: string;
}

function Canvas({ spaceId }: CanvasProps) {
  return (
    <main className="h-full w-full relative bg-netural-100 touch-none">
      <Info />
      <Toolbar />
    </main>
  );
}

export default Canvas;
