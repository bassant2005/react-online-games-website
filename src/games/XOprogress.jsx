// XOprogress.js
import { useState, useEffect } from "react";

export default function useProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const gamesList = JSON.parse(localStorage.getItem("gamesList")) || [];
      const gamesProfile = JSON.parse(localStorage.getItem("games")) || [];
      const ticTacToe = gamesProfile.find((g) => g.title === "Tic Tac Toe");
      const gameProgress = ticTacToe ? ticTacToe.progress : 0;

      if (gamesList.length === 0 || gameProgress === 0) {
        setProgress(0);
        return;
      }

      const total = gamesList.length;
      const won = gamesList.filter((g) => g.win).length;
      const percent = Math.round((won / total) * 100);

      setProgress(percent);

      // update the profile list's progress for Tic Tac Toe
      const updatedGamesProfile = gamesProfile.map((g) =>
        g.title === "Tic Tac Toe" ? { ...g, progress: percent } : g
      );
      localStorage.setItem("games", JSON.stringify(updatedGamesProfile));

      // notify any listeners (e.g. your profile component)
      window.dispatchEvent(new Event("gamesUpdated"));
    };

    // run once on mount
    updateProgress();

    // listen for (a) storage changes from other tabs and (b) custom gamesUpdated
    window.addEventListener("storage", updateProgress);
    window.addEventListener("gamesUpdated", updateProgress);

    // cleanup
    return () => {
      window.removeEventListener("storage", updateProgress);
      window.removeEventListener("gamesUpdated", updateProgress);
    };
  }, []);

  return [progress, setProgress];
}
