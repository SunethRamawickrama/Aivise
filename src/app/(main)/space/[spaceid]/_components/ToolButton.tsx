"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import Hint from "./Hint";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

function ToolButton({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
}: ToolButtonProps) {
  return (
    <Hint label={label} side="right">
      <Button></Button>
    </Hint>
  );
}

export default ToolButton;
