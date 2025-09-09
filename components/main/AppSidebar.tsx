"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, GraduationCap } from "lucide-react";

export default function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col w-64 bg-neutral-100 dark:bg-neutral-900 p-4 transition-all duration-300"
        )}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-10 w-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <span className="text-white dark:text-black font-bold">K</span>
          </div>
          <h1 className="text-xl text-black dark:text-white font-semibold">
            Keross
          </h1>
        </div>

        {/* Section Heading */}
        <h2 className="text-xs uppercase text-gray-400 dark:text-gray-500 mb-2">
          Application
        </h2>

        {/* Navigation List */}
        <nav className="space-y-2">
          <a
            href="#"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
          >
            <GraduationCap className="h-5 w-5" />
            <span>Training</span>
          </a>
        </nav>
        <div className="flex items-end h-screen">
              <p className="text-xs font-light">© 2025 Keross. All Rights Reserved </p>
            </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden p-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 bg-neutral-100 dark:bg-neutral-900 p-4"
          >
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-8 w-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <span className="text-white dark:text-black font-bold">K</span>
              </div>
              <h1 className="text-xl text-black dark:text-white font-bold">
                Keross
              </h1>
            </div>

            {/* Section Heading */}
            <h2 className="text-sm uppercase text-slate-600 dark:text-gray-400">
              Application
            </h2>

            {/* Navigation List */}
            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Training</span>
              </a>
            </nav>
            <SheetFooter>
              <p className="text-xs font-light md:text-xl md:font-medium ">© 2025 Keross. All Rights Reserved </p>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
