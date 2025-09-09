"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleDarkMode } from "@/store/themeSlice";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function AppHeader() {
  const dispatch = useDispatch();
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
        {/* Dark Mode Button */}
        <Button variant="ghost" size="icon" onClick={() => dispatch(toggleDarkMode())}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <Button variant="ghost" size="sm">
          Login
        </Button>
      </div>
    </header>
  );
}
