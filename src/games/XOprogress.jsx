// XOprogress.js
import { useState, useEffect } from "react";

export default function useProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      let gamesList = JSON.parse(localStorage.getItem("gamesList")) || [];
      let gamesProfile = JSON.parse(localStorage.getItem("games")) || [];

      if (gamesList.length === 0) {
        setProgress(0);
        return;
      }

      // 🎯 Calculate progress
      const total = gamesList.length;
      const won = gamesList.filter((g) => g.win).length;
      const percent = Math.round((won / total) * 100);
      setProgress(percent);

      // 🎯 Update Tic Tac Toe inside games profile
      const updatedGames = gamesProfile.map((g) =>
        g.title === "Tic Tac Toe" ? { ...g, progress: percent } : g
      );

      // ✅ Save back to localStorage
      localStorage.setItem("games", JSON.stringify(updatedGames));

      // 🔔 Notify same-tab listeners
      window.dispatchEvent(new Event("gamesUpdated"));
    };

    updateProgress();

    // Listen for changes
    window.addEventListener("storage", updateProgress);
    window.addEventListener("gamesUpdated", updateProgress);

    return () => {
      window.removeEventListener("storage", updateProgress);
      window.removeEventListener("gamesUpdated", updateProgress);
    };
  }, []);

  return [progress, setProgress];
}
