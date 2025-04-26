"use client";

import React from "react";
import { Pencil, Highlighter, Circle, MoreVertical, Undo, Redo } from "lucide-react";

function Toolbar() {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Pencil className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-yellow-100 rounded-md">
          <Highlighter className="w-5 h-5 text-yellow-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Circle className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Undo className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Redo className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
