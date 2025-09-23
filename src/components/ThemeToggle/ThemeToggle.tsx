import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-muted/50 transition-colors relative flex items-center justify-center w-10 h-10"
      aria-label={`Toggle to ${
        resolvedTheme === "light" ? "dark" : "light"
      } theme`}
    >
      <Sun className="h-5 w-5 absolute transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="h-5 w-5 absolute transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </button>
  );
};

export default ThemeToggle;
