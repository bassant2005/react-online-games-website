// XOprogress.js
import { useState, useEffect } from "react";

export default function useProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      let games = JSON.parse(localStorage.getItem("gamesList")) || [];
      if (games.length === 0) {
        setProgress(0);
        return;
      }

      const total = games.length;
      const won = games.filter((g) => g.win).length;

      // 🎯 Calculate percentage
      const percent = Math.round((won / total) * 100);
      setProgress(percent);
    };

    updateProgress();

    // ✅ Listen for localStorage changes (other tabs/components)
    window.addEventListener("storage", updateProgress);
    return () => window.removeEventListener("storage", updateProgress);
  }, []);

  return [progress, setProgress];
}
