import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles.css";
import "../games.css";
import "./matching.css";

const SYMBOLS = {
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    faces: [
        "fa-thin fa-face-grin-stars",
        "fa-thin fa-face-grin-hearts",
        "fa-thin fa-face-grin-wink",
        "fa-thin fa-face-rolling-eyes",
        "fa-thin fa-face-laugh-beam",
        "fa-thin fa-face-grin-tears",
        "fa-thin fa-face-grin-tongue-wink",
        "fa-thin fa-face-angry",
        "fa-thin fa-face-surprise",
        "fa-thin fa-face-smile"
    ],
};

const LEVELS = ["Easy", "Medium", "Hard", "Expert"];
const LEVEL_SIZES = { Easy: 6, Medium: 10, Hard: 16, Expert: 20 };

function Matching() {
    const navigate = useNavigate();

    const [symbolType, setSymbolType] = useState(null);
    const [level, setLevel] = useState(null);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);
    const [hasWon, setHasWon] = useState(false);

    const startGame = (levelName) => {
        const size = LEVEL_SIZES[levelName];
        const values = SYMBOLS[symbolType].slice(0, size / 2);

        const deck = [...values, ...values]
            .sort(() => Math.random() - 0.5)
            .map((value, index) => ({ id: index, value }));

        setLevel(levelName);
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

            const currentLevelIndex = LEVELS.indexOf(level);
            const progressValue = ((currentLevelIndex + 1) * 25);

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
            if (currentLevelIndex < LEVELS.length - 1) {
                setTimeout(() => {
                    startGame(LEVELS[currentLevelIndex + 1]);
                }, 1500); // small delay before next level
            }
        }
    }, [matched]);

    return (
        <div className="container text-center mt-4">
            <h3>🧠 Memory Matching Game</h3>

            {/* SYMBOL CHOICE */}
            {!symbolType && (
                <>
                    <h3>Choose what to play with</h3>
                    <div className="d-flex justify-content-center gap-3">
                        <button className="btn" onClick={() => setSymbolType("numbers")}>
                            🔢 Numbers
                        </button>
                        <button className="btn" onClick={() => setSymbolType("letters")}>
                            🔠 Letters
                        </button>
                        <button className="btn" onClick={() => setSymbolType("faces")}>
                            😊 Faces
                        </button>
                    </div>
                </>
            )}

            {/* LEVEL CHOICE */}
            {symbolType && !level && (
                <>
                    <h3>Choose difficulty</h3>
                    <div className="d-flex justify-content-center gap-3">
                        {LEVELS.map((lvl) => (
                            <button className="btn" key={lvl} onClick={() => startGame(lvl)}>
                                {lvl}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* GAME BOARD */}
            {level && (
                <>
                    <h3>
                        {hasWon ? "🎉 Level Complete!" : `Flip two cards - ${level}`}
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
                                        (symbolType === "faces" ? (
                                            <i className={`fa-solid ${card.value}`}></i>
                                        ) : (
                                            card.value
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CONTROLS */}
                    <div className="mt-4 d-flex justify-content-center gap-3">
                        <button className="btn" onClick={() => setLevel(null)}>
                            Change Level
                        </button>
                        <button
                            className="btn"
                            onClick={() => {
                                setSymbolType(null);
                                setLevel(null);
                                setCards([]);
                                setFlipped([]);
                                setMatched([]);
                                setHasWon(false);
                            }}
                        >
                            Restart
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
