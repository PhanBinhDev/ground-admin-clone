"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ComponentProps, ReactElement, ReactNode } from "react";

/**
 * Tooltip in one tag. Wrap any single trigger element:
 *   <Hint label="Bewerken"><button>…</button></Hint>
 * No `label` → renders the child untouched (so it's safe to pass a dynamic hint).
 */
export function Hint({
  label,
  children,
  side = "top",
  align = "center",
  delay = 200,
}: {
  label: ReactNode;
  children: ReactElement;
  side?: ComponentProps<typeof TooltipContent>["side"];
  align?: ComponentProps<typeof TooltipContent>["align"];
  delay?: number;
}) {
  if (!label) return children;
  return (
    <TooltipProvider delay={delay}>
      <Tooltip>
        <TooltipTrigger render={children} />
        <TooltipContent side={side} align={align}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
