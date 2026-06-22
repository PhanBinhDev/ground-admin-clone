"use client";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { nl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

/** "YYYY-MM-DD" → local Date (no timezone shift; these are calendar dates). */
function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toStr(date?: Date): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calendar date picker (shadcn Calendar + Popover) — replaces the OS-native
 * `<input type="date">` so the picker is styled and localized (Dutch), not the
 * browser's locale. Value/onChange use "YYYY-MM-DD" strings.
 */
export function DatePicker({
  value,
  onChange,
  placeholder,
  id,
  minDate,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  /** Disable days before this "YYYY-MM-DD" (e.g. today → no past dates). */
  minDate?: string;
}) {
  const [open, setOpen] = useState(false);
  const date = toDate(value);
  const min = toDate(minDate);

  return (
    // Wrapper so Base UI's focus-guard <span> (appended on open) stays inside here and
    // isn't picked up by a parent `space-y-*` as an extra spaced child (would shift layout).
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              id={id}
              className={cn(
                "border-input focus-visible:border-ring focus-visible:ring-ring/50 hover:border-ring/40 flex h-11 w-full items-center gap-2 rounded-lg border bg-transparent px-3 text-left text-sm transition-colors outline-none focus-visible:ring-3",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="size-4 shrink-0" />
              {date
                ? date.toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : (placeholder ?? "Kies een datum")}
            </button>
          }
        />
        {/* initialFocus=false: don't move focus into the calendar on open — Base UI would
          focus the first day button without preventScroll, scrolling the tall popup into
          view (= the page "jumps down"). Mouse users pick dates fine. */}
        <PopoverContent align="start" className="w-auto p-0" initialFocus={false}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              onChange(toStr(d));
              setOpen(false);
            }}
            disabled={min ? { before: min } : undefined}
            locale={nl}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
