import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import "../games.css";
import "./matching.css";

const SYMBOLS = {
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    faces: [
        "U_U",
        ">_<",
        ">.<",
        "UwU",
        "^_^",
        "T_T",
        "O_O",
        ">o<",
        "^_~",
        "(●'◡'●)",
    ],
};

const LEVELS = ["Easy", "Medium", "Hard", "Expert"];
const LEVEL_SIZES = { Easy: 6, Medium: 10, Hard: 16, Expert: 20 };

function Matching() {
    const navigate = useNavigate();

    const [symbolType, setSymbolType] = useState(null);
    const [levelIndex, setLevelIndex] = useState(0); // start at Easy
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);
    const [hasWon, setHasWon] = useState(false);

    // Start the game for current level
    const startGame = (symbol, levelIdx) => {
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

    // Check for win
    useEffect(() => {
        if (cards.length > 0 && matched.length === cards.length) {
            setHasWon(true);

            // Update progress in localStorage
            const stored = JSON.parse(localStorage.getItem("games")) || [];
            const gameIndex = stored.findIndex((g) => g.title === "Memory Match");

            const progressValue = ((levelIndex + 1) * 25);

            if (gameIndex >= 0) {
                stored[gameIndex] = {
                    ...stored[gameIndex],
                    progress: Math.max(stored[gameIndex].progress, progressValue),
                };
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

            // Auto-unlock next level if exists
            if (levelIndex < LEVELS.length - 1) {
                setTimeout(() => {
                    startGame(symbolType, levelIndex + 1);
                }, 1500); // small delay before next level
            }
        }
    }, [matched]);

    // Start the first level automatically
    useEffect(() => {
        if (!symbolType) {
            setSymbolType("numbers"); // default choice at start
            startGame("numbers", 0); // Easy level
        }
    }, []);

    return (
        <div className="container text-center mt-4">
            <h3>🧠 Memory Matching Game</h3>

            <h3>{hasWon ? `🎉 Level Complete!` : `Flip two cards - ${LEVELS[levelIndex]}`}</h3>

            <div className="memory-board">
                {cards.map((card, index) => (
                    <div key={card.id}>
                        <div
                            className={`square ${flipped.includes(index) || matched.includes(index) ? "active" : ""}`}
                            onClick={() => handleFlip(index)}
                        >
                            {(flipped.includes(index) || matched.includes(index)) && card.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* CONTROLS */}
            <div className="mt-4 mb-4 d-flex justify-content-center gap-3">
                <button
                    className="btn"
                    onClick={() => startGame(symbolType, levelIndex)} // restart current level
                >
                    Restart Level
                </button>
                <button
                    className="btn"
                    onClick={() => navigate("/")}
                >
                    Leave
                </button>
            </div>
        </div>
    );
}

export default Matching;
