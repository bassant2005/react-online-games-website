import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import "../games.css";
import "./matching.css";

const SYMBOLS = {
    numbers: ["10", "11", "100", "111", "101", "010", "0", "0110", "1111", "1001"],
    letters: ["N", "M", "C", "D", "R", "U", "G", "O", "V", "W"],
    faces: [
        "❤️",
        "⚽",
        "🎶",
        "🤖",
        "🦋",
        "🎈",
        "📙",
        "🍕",
        "🍎",
        "🚗",
    ],
};

const LEVELS = ["Easy", "Medium", "Hard", "Expert"];
const LEVEL_SIZES = { Easy: 6, Medium: 10, Hard: 16, Expert: 20 };

function Matching() {
    const navigate = useNavigate();

    const [symbolType, setSymbolType] = useState(null); // ⬅️ ask user
    const [levelIndex, setLevelIndex] = useState(0);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);
    const [hasWon, setHasWon] = useState(false);

    // 🎮 Start game
    const startGame = (symbol, levelIdx = 0) => {
        const size = LEVEL_SIZES[LEVELS[levelIdx]];
        const values = SYMBOLS[symbol].slice(0, size / 2);

        const deck = [...values, ...values]
            .sort(() => Math.random() - 0.5)
            .map((value, index) => ({ id: index, value }));

        setSymbolType(symbol);
        setLevelIndex(levelIdx);
        setCards(deck);
        setFlipped([]);
        setMatched([]);
        setLockBoard(false);
        setHasWon(false);
    };

    const handleFlip = (index) => {
        if (lockBoard) return;
        if (flipped.includes(index) || matched.includes(index)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setLockBoard(true);
            const [a, b] = newFlipped;

            if (cards[a].value === cards[b].value) {
                setMatched((prev) => [...prev, a, b]);
                setFlipped([]);
                setLockBoard(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setLockBoard(false);
                }, 800);
            }
        }
    };

    // 🏆 Win logic + progress
    useEffect(() => {
        if (cards.length > 0 && matched.length === cards.length) {
            setHasWon(true);

            const stored = JSON.parse(localStorage.getItem("games")) || [];
            const gameIndex = stored.findIndex((g) => g.title === "Memory Match");

            const progressValue = (levelIndex + 1) * 25;

            if (gameIndex >= 0) {
                stored[gameIndex].progress = Math.max(
                    stored[gameIndex].progress,
                    progressValue
                );
            } else {
                stored.push({
                    title: "Memory Match",
                    genre: "Memory / Puzzle",
                    img: "/images/matching.png",
                    rating: 0,
                    progress: progressValue,
                });
            }

            localStorage.setItem("games", JSON.stringify(stored));
            window.dispatchEvent(new Event("gamesUpdated"));

            // 🔓 Unlock next level
            if (levelIndex < LEVELS.length - 1) {
                setTimeout(() => {
                    startGame(symbolType, levelIndex + 1);
                }, 1500);
            }
        }
    }, [matched]);

    // 🔁 FULL RESET
    const restartGame = () => {
        // reset progress to 0
        const stored = JSON.parse(localStorage.getItem("games")) || [];
        const gameIndex = stored.findIndex((g) => g.title === "Memory Match");

        if (gameIndex >= 0) {
            stored[gameIndex].progress = 0;
            localStorage.setItem("games", JSON.stringify(stored));
            window.dispatchEvent(new Event("gamesUpdated"));
        }

        setSymbolType(null); // ⬅️ re-ask symbols
        setLevelIndex(0);
        setCards([]);
        setFlipped([]);
        setMatched([]);
        setHasWon(false);
    };

    return (
        <div className="container text-center mt-4">
            <h3>🧠 Memory Matching Game</h3>

            {/* 🔢 SYMBOL CHOICE */}
            {!symbolType && (
                <>
                    <h4>Choose what you want to play with</h4>
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        <button className="btn" onClick={() => startGame("numbers")}>
                            🔢 Numbers
                        </button>
                        <button className="btn" onClick={() => startGame("letters")}>
                            🔠 Letters
                        </button>
                        <button className="btn" onClick={() => startGame("faces")}>
                            😊 Faces
                        </button>
                    </div>
                </>
            )}

            {/* 🧩 GAME */}
            {symbolType && (
                <>
                    <h3>
                        {hasWon
                            ? "🎉 Level Complete!"
                            : `Flip two cards - ${LEVELS[levelIndex]}`}
                    </h3>

                    <div className="memory-board">
                        {cards.map((card, index) => (
                            <div key={card.id}>
                                <div
                                    className={`square ${
                                        flipped.includes(index) || matched.includes(index)
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => handleFlip(index)}
                                >
                                    {(flipped.includes(index) || matched.includes(index)) &&
                                        card.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🎛 CONTROLS */}
                    <div className="mt-4 mb-4 d-flex justify-content-center gap-3">
                        <button className="btn" onClick={restartGame}>
                            Restart Game
                        </button>
                        <button className="btn" onClick={() => navigate("/")}>
                            Leave
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Matching;