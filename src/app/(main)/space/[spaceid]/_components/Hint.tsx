import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface HintProps {
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  children: React.ReactNode;
}

function Hint({ label, side = "right", sideOffset = 0, children }: HintProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} sideOffset={sideOffset}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default Hint;
