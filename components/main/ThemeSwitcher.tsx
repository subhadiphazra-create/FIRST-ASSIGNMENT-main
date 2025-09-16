"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleDarkMode } from "@/store/themeSlice";
import { ThemeSwitcherButton } from "../ui/ThemeSwitcherButton";
const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div>
      <ThemeSwitcherButton
        className="h-10 w-20 pl-1 bg-card"
        onCheckedChange={() => dispatch(toggleDarkMode())}
        aria-label="Toggle dark mode"
        checked={darkMode}
      />
    </div>
  );
};

export default ThemeSwitcher;
