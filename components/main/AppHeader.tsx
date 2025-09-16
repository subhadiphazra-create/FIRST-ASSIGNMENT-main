"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "./ThemeSwitcher";

export default function AppHeader() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="w-full bg-background border-b flex items-end justify-end px-4 py-2">
      <div className="flex space-x-2">
        <ThemeSwitcher />
        <Button variant="ghost" size="sm">
          Login
        </Button>
      </div>
    </header>
  );
}