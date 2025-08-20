"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(systemDark);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (!isMounted) return null;

  return (
    <div className="flex items-center gap-2">
      <Sun className="size-4" />
      <Switch checked={isDark} onCheckedChange={toggleTheme} />
      <Moon className="size-4" />
    </div>
  );
}
