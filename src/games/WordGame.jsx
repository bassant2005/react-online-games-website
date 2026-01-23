import React, { useState, useEffect } from "react";
import "./WordGame.css";
import { useNavigate, useLocation } from "react-router-dom";
import useSound from "use-sound";
import moveSound from "../assets/sounds/move.mp3";
import hintSound from "../assets/sounds/help.wav";
import winSound from "../assets/sounds/win.wav";
import loseSound from "../assets/sounds/lose.wav";

function WordGame() {
  const navigate = useNavigate();
  const location = useLocation();

  let games = JSON.parse(localStorage.getItem("games")) || [];
  const index = games.findIndex((g) => g.title === "Wordle");

  // ---------------- GAME CONFIG ----------------
  const gameName = "Guess the Word";
  const levels = [
    { word: "cat", desc: "A small domestic animal", tries: 2, hints: 0 },
    { word: "dog", desc: "Man's best friend", tries: 2, hints: 0 },
    { word: "sun", desc: "Gives us light", tries: 2, hints: 0 },
    { word: "apple", desc: "A sweet red or green fruit", tries: 3, hints: 0 },
    { word: "grape", desc: "Round purple or green fruit", tries: 3, hints: 0 },
    { word: "peach", desc: "Juicy fruit with fuzzy skin", tries: 3, hints: 0 },
    { word: "journey", desc: "A long trip", tries: 5, hints: 1 },
    { word: "fantasy", desc: "Imaginative fiction world", tries: 5, hints: 1 },
    { word: "mystery", desc: "Something unknown or puzzling", tries: 5, hints: 1 },
    { word: "basketball", desc: "A popular team sport", tries: 7, hints: 3 },
    { word: "journalist", desc: "Someone who writes news", tries: 7, hints: 3 },
    { word: "spacecraft", desc: "Vehicle to travel in space", tries: 7, hints: 3 },
    { word: "quantum leap", desc: "A sudden and significant change or advance", tries: 7, hints: 3 },
    { word: "black market", desc: "Illegal trade of goods or services", tries: 7, hints: 3 },
    { word: "time capsule", desc: "A container storing objects for future discovery", tries: 7, hints: 3 },
  ];

  // ---------------- GAME STATE ----------------
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [currentDesc, setCurrentDesc] = useState("");
  const [tries, setTries] = useState(0);
  const [, setLetters] = useState(0);
  const [, setHints] = useState(0);
  const [currentTry, setCurrentTry] = useState(1);
  const [inputs, setInputs] = useState([]);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [hintsLeft, setHintsLeft] = useState(0);
  const [progress, setProgress] = useState(index !== -1 ? games[index].progress : 0);
  const [gameOver, setGameOver] = useState(false);

  // ---------------- SOUNDS ----------------
  const [playMove] = useSound(moveSound);
  const [playHint] = useSound(hintSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);

  // 🔇 MUTE
  const [muted, setMuted] = useState(false);

  // ---------------- START LEVEL ----------------
  const startLevel = (levelIndex, resetProgress = false) => {
    if (resetProgress) {
      setProgress(0);
      if (index !== -1) {
        games[index].progress = 0;
        localStorage.setItem("games", JSON.stringify(games));
      }
      levelIndex = 0;
    }

    const level = levels[levelIndex];
    if (!level) {
      setMessage("🏆 Congratulations! You finished the game 🎉");
      playWin();
      return;
    }

    const chosenWord = level.word.toUpperCase();
    const chosenDesc = level.desc;

    setCurrentLevel(levelIndex);
    setCurrentWord(chosenWord);
    setCurrentDesc(chosenDesc);
    setTries(level.tries);
    setLetters(level.word.replace(/ /g, "").length);
    setHints(level.hints);
    setHintsLeft(level.hints);
    setCurrentTry(1);
    setGameOver(false);

    const wordArr = chosenWord.split("");
    setInputs(
        Array.from({ length: level.tries }, () =>
            wordArr.map((ch) => (ch === " " ? "/" : ""))
        )
    );
    setResults(
        Array.from({ length: level.tries }, () =>
            wordArr.map((ch) => (ch === " " ? "space" : ""))
        )
    );

    setMessage(`Level ${levelIndex + 1}`);
  };

  // ---------------- FIRST LOAD ----------------
  useEffect(() => {
    if (index !== -1) {
      const savedProgress = games[index].progress;
      if (savedProgress >= 100) {
        setMessage("🏆 Congratulations! You already finished the game 🎉");
        playWin();
      } else {
        const savedLevel = Math.floor((savedProgress / 100) * levels.length);
        startLevel(savedLevel);
      }
    } else {
      startLevel(0);
    }
  }, [location.key]);

  // ---------------- HANDLE INPUT ----------------
  const handleInputChange = (tryIndex, letterIndex, value) => {
    if (currentWord[letterIndex] === " ") return;
    const updatedInputs = [...inputs];
    updatedInputs[tryIndex][letterIndex] = value.toUpperCase();
    setInputs(updatedInputs);
    playMove();

    // move focus forward
    if (value) {
      const nextInput = document.querySelector(
          `#try-${tryIndex}-letter-${letterIndex + 2}`
      );
      if (nextInput) nextInput.focus();
    }
  };

  // ---------------- CHECK WORD ----------------
  const handleCheck = () => {
    const guess = inputs[currentTry - 1]
        .map((ch, idx) => (currentWord[idx] === " " ? " " : ch))
        .join("");

    const newResults = [...results];
    const resultRow = [];

    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === " ") resultRow[i] = "space";
      else if (guess[i] === currentWord[i]) resultRow[i] = "in-place";
      else if (currentWord.includes(guess[i])) resultRow[i] = "not-in-place";
      else resultRow[i] = "wrong";
    }

    newResults[currentTry - 1] = resultRow;
    setResults(newResults);

    if (guess === currentWord) {
      const newProgress = Math.round(((currentLevel + 1) / levels.length) * 100);
      setProgress(newProgress);
      if (index !== -1) {
        games[index].progress = newProgress;
        localStorage.setItem("games", JSON.stringify(games));
      }
      setMessage(`🎉 You cleared Level ${currentLevel + 1}! Progress: ${newProgress}%`);
      playWin();

      if (currentLevel < levels.length - 1) {
        setTimeout(() => startLevel(currentLevel + 1), 1500);
      }
    } else {
      if (currentTry < tries) {
        setMessage("❌ Not yet! Keep trying...");
        setCurrentTry(currentTry + 1);
      } else {
        setMessage(`💀 Game Over! The word was ${currentWord}`);
        setGameOver(true);
        playLose();
      }
    }
  };

  // ---------------- HINT ----------------
  const handleHint = () => {
    if (hintsLeft > 0) {
      const emptyIndices = [];
      currentWord.split("").forEach((ch, idx) => {
        if (ch !== " " && !inputs[currentTry - 1][idx]) emptyIndices.push(idx);
      });

      if (emptyIndices.length > 0) {
        const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const newInputs = [...inputs];
        newInputs[currentTry - 1][randomIdx] = currentWord[randomIdx];
        setInputs(newInputs);
        setHintsLeft(hintsLeft - 1);
        playHint();
      }
    } else {
      setMessage("⚠ No hints left!");
    }
  };

  const handleTryAgain = () => startLevel(currentLevel, false);

  return (
      <div className="guess-game">
        <h1>{gameName} ✍</h1>
        {/* 🔇 MUTE BUTTON */}
        <button
            className="btn btn-sm mb-3"
            onClick={() => setMuted(!muted)}
        >
          {muted ? "🔇 Muted" : "🔊 Sound On"}
        </button>
        <div className="game-area">
          <div className="message">
            <span>{message}</span><br /><br />
            {currentDesc && <em><span>Description: </span>{currentDesc}</em>}
            <br /><br />
            <span>Progress: </span>{progress}%
          </div>

          <div className="content-row">
            <div className="control d-flex">
              <button className="gamesB" onClick={handleCheck}>Check Word</button>
              <button className="gamesB" onClick={handleHint} disabled={hintsLeft === 0}>Hint ({hintsLeft})</button>
              <button className="gamesB" onClick={handleTryAgain}>Try Again</button>
              <button className="gamesB" onClick={() => startLevel(currentLevel, true)}>Restart</button>
              <button className="gamesB" onClick={() => navigate("/")}>Leave</button>
            </div>
            <br/><br/>
            <div className="inputs">
              {inputs.map((tryRow, tryIndex) => (
                  <div key={tryIndex} className={`try ${currentTry - 1 === tryIndex ? "" : "disabled"}`}>
                    <span>Try {tryIndex + 1}:</span>
                    <div className="try-inputs">
                      {tryRow.map((letter, letterIndex) =>
                          currentWord[letterIndex] === " " ? (
                              <input key={letterIndex} type="text" value="/" disabled className="space-box" />
                          ) : (
                              <input
                                  key={letterIndex}
                                  id={`try-${tryIndex}-letter-${letterIndex + 1}`}
                                  type="text"
                                  maxLength={1}
                                  value={letter}
                                  disabled={gameOver || currentTry - 1 !== tryIndex}
                                  onChange={(e) => handleInputChange(tryIndex, letterIndex, e.target.value)}
                                  className={results[tryIndex]?.[letterIndex] || ""}
                              />
                          )
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default WordGame;
