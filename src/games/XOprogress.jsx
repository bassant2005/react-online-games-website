// XOprogress.js
import { useState, useEffect } from "react";

export default function useProgress() {
  // ✅ Initialize directly from localStorage (no flicker to 0)
  const [progress, setProgress] = useState(() => {
    return parseInt(localStorage.getItem("TicTacToeProgress")) || 0;
  });

  // ✅ Keep it in sync when updated
  useEffect(() => {
    localStorage.setItem("TicTacToeProgress", progress);
  }, [progress]);

  return [progress, setProgress];
}
