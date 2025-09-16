"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

const ThemeSwitcherButton = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 dark:border-gray-700 shadow-md transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-80 bg-card data-[state=unchecked]:bg-input relative",
      className
    )}
    {...props}
  >
    {/* Moon Icon (Dark Mode) */}
    <Moon
      className={cn(
        "h-4 w-4 absolute z-[1000] top-[10px] left-[10px] stroke-gray-600 fill-white transition-opacity duration-300 ease-in-out",
        "data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0"
      )}
    />

    {/* Switch Thumb */}
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-7 w-7 rounded-full bg-white dark:bg-gray-800 shadow-2xl ring-0 transition-transform duration-300 ease-in-out data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
      )}
    />

    {/* Sun Icon (Light Mode) */}
    <Sun
      className={cn(
        "h-4 w-4 absolute z-[1000] top-[10px] right-[18px] stroke-gray-600 fill-white transition-opacity duration-300 ease-in-out",
        "data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100"
      )}
    />
  </SwitchPrimitives.Root>
));

ThemeSwitcherButton.displayName = SwitchPrimitives.Root.displayName;

export { ThemeSwitcherButton };
