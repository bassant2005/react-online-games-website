import React, { useState, useEffect } from "react";
import "./WordGame.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function WordGame() {
  const navigate = useNavigate();

  // ---------------- GAME CONFIG ----------------
  const gameName = "Guess the Word";

  const levels = [
    // 3-letter words (no hints)
    { word: "cat", desc: "A small domestic animal", tries: 2, hints: 0 },
    { word: "dog", desc: "Man's best friend", tries: 2, hints: 0 },
    { word: "sun", desc: "Gives us light", tries: 2, hints: 0 },

    // 5-letter words (no hints)
    { word: "apple", desc: "A sweet red or green fruit", tries: 3, hints: 0 },
    { word: "grape", desc: "Round purple or green fruit", tries: 3, hints: 0 },
    { word: "peach", desc: "Juicy fruit with fuzzy skin", tries: 3, hints: 0 },

    // 7-letter words (hints start here)
    { word: "journey", desc: "A long trip", tries: 5, hints: 1 },
    { word: "fantasy", desc: "Imaginative fiction world", tries: 5, hints: 1 },
    { word: "mystery", desc: "Something unknown or puzzling", tries: 5, hints: 1 },

    // 10-letter words
    { word: "basketball", desc: "A popular team sport", tries: 7, hints: 3 },
    { word: "journalist", desc: "Someone who writes news", tries: 7, hints: 3 },
    { word: "spacecraft", desc: "Vehicle to travel in space", tries: 7, hints: 3 },

    // multi-word (spaces count, still hints allowed)
    { word: "quantum leap", desc: "A sudden and significant change or advance", tries: 7, hints: 3 },
    { word: "black market", desc: "Illegal trade of goods or services", tries: 7, hints: 3 },
    { word: "time capsule", desc: "A container storing objects for future discovery", tries: 7, hints: 3 },
  ];

  // ---------------- GAME STATE ----------------
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [currentDesc, setCurrentDesc] = useState("");
  const [tries, setTries] = useState(0);
  const [letters, setLetters] = useState(0);
  const [hints, setHints] = useState(0);
  const [currentTry, setCurrentTry] = useState(1);
  const [inputs, setInputs] = useState([]);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [hintsLeft, setHintsLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  // ---------------- START LEVEL ----------------
  const startLevel = (levelIndex, resetProgress = false) => {
    if (resetProgress) {
      localStorage.setItem("wordGameProgress", "0");
      setProgress(0);
      levelIndex = 0;
    }

    const level = levels[levelIndex];
    if (!level) {
      setMessage("🏆 Congratulations! You finished the game 🎉");
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

    // keep spaces as "/"
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

    setMessage(`Level ${levelIndex + 1}: Try to guess the word`);
  };
  
  // ---------------- FIRST LOAD ----------------
  const location = useLocation();
  useEffect(() => {
    const savedProgress =
      parseInt(localStorage.getItem("wordGameProgress")) || 0;
    setProgress(savedProgress);

    if (savedProgress >= 100) {
      setMessage("🏆 Congratulations! You already finished the game 🎉");
    } else {
      const savedLevel = Math.floor((savedProgress / 100) * levels.length);
      startLevel(savedLevel); // 🚀 don’t reset here
    }
  }, [location.key]);

  // ---------------- HANDLE INPUT ----------------
  const handleInputChange = (tryIndex, letterIndex, value) => {
    if (currentWord[letterIndex] === " ") return; // ignore typing into spaces

    const updatedInputs = [...inputs];
    updatedInputs[tryIndex][letterIndex] = value.toUpperCase();
    setInputs(updatedInputs);

    // Move forward if typed, backward if deleted
    if (value) {
      const nextInput = document.querySelector(
        `#try-${tryIndex}-letter-${letterIndex + 2}`
      );
      if (nextInput) nextInput.focus();
    } else {
      const prevInput = document.querySelector(
        `#try-${tryIndex}-letter-${letterIndex}`
      );
      if (prevInput) prevInput.focus();
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
      if (currentWord[i] === " ") {
        resultRow[i] = "space";
        continue;
      }
      if (guess[i] === currentWord[i]) {
        resultRow[i] = "in-place";
      } else if (currentWord.includes(guess[i])) {
        resultRow[i] = "not-in-place";
      } else {
        resultRow[i] = "wrong";
      }
    }

    newResults[currentTry - 1] = resultRow;
    setResults(newResults);

    if (guess === currentWord) {
      const newProgress = Math.round(((currentLevel + 1) / levels.length) * 100);

      setProgress(newProgress);
      localStorage.setItem("wordGameProgress", newProgress.toString());
      
      let games = JSON.parse(localStorage.getItem("games")) || [];
      // Find the game by title
      const index = games.findIndex(g => g.title === "Wordle");
      if (index !== -1) {
        games[index].progress = newProgress; // new progress value
        localStorage.setItem("games", JSON.stringify(games));
      }

      setMessage(
        `🎉 You cleared Level ${currentLevel + 1}! Progress: ${newProgress}%`
      );

      if (currentLevel < levels.length - 1) {
        setTimeout(() => startLevel(currentLevel + 1), 1500);
      } else {
        setMessage("🏆 Congratulations! You finished the game 🎉");
      }
    } else {
      if (currentTry < tries) {
        setMessage("❌ Not yet! Keep trying...");
        setCurrentTry(currentTry + 1);
      } else {
        setMessage(`💀 Game Over! The word was ${currentWord}`);
      }
    }
  };

  // ---------------- HINT ----------------
  const handleHint = () => {
    if (hintsLeft > 0) {
      const emptyIndices = [];
      currentWord.split("").forEach((ch, idx) => {
        if (ch !== " " && !inputs[currentTry - 1][idx]) {
          emptyIndices.push(idx);
        }
      });

      if (emptyIndices.length > 0) {
        const randomIdx =
          emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const newInputs = [...inputs];
        newInputs[currentTry - 1][randomIdx] = currentWord[randomIdx];
        setInputs(newInputs);
        setHintsLeft(hintsLeft - 1);
      }
    } else {
      setMessage("⚠ No hints left!");
    }
  };

  return (
    <div className="guess-game">
      <h1>{gameName} ✍</h1>
      {/* game area */}
      <div className="game-area">
        <div className="message">
          {message} <br />
          {currentDesc && <em>Description: {currentDesc}</em>}
          <br />
          Progress: {progress}%
        </div>

        <div className="content-row">
          {/* inputs */}
          <div className="inputs">
            {inputs.map((tryRow, tryIndex) => (
              <div
                key={tryIndex}
                className={`try ${
                  currentTry - 1 === tryIndex ? "" : "disabled"
                }`}
              >
                <span>Try {tryIndex + 1}:</span>
                {tryRow.map((letter, letterIndex) =>
                  currentWord[letterIndex] === " " ? (
                    <input
                      key={letterIndex}
                      type="text"
                      value="/"
                      disabled
                      className="space-box"
                    />
                  ) : (
                    <input
                      key={letterIndex}
                      id={`try-${tryIndex}-letter-${letterIndex + 1}`}
                      type="text"
                      maxLength={1}
                      value={letter}
                      disabled={currentTry - 1 !== tryIndex}
                      onChange={(e) =>
                        handleInputChange(tryIndex, letterIndex, e.target.value)
                      }
                      className={results[tryIndex]?.[letterIndex] || ""}
                    />
                  )
                )}
              </div>
            ))}
          </div>

          {/* key legend */}
          <div className="key-colors">
            <h2>Key Colors</h2>

            <div className="key-color">
              <div className="key in-place"></div>
              <div className="text">Correct letter and in place</div>
            </div>
            <div className="key-color">
              <div className="key not-in-place"></div>
              <div className="text">Correct letter but not in place</div>
            </div>
            <div className="key-color">
              <div className="key wrong"></div>
              <div className="text">The letter is not in this word</div>
            </div>

            <div className="control d-flex">
              <button className="check" onClick={handleCheck}>
                Check Word
              </button>
              <button onClick={handleHint} disabled={hintsLeft === 0}>
                Hint ({hintsLeft})
              </button>
            </div>

            <div className="control d-flex">
              <button onClick={() => startLevel(currentLevel, true)}>
                Restart
              </button>
              <button className="leave-btn" onClick={() => navigate("/")}>
                Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordGame;
