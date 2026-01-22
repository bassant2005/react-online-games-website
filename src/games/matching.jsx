import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import "../games.css";
import "./matching.css";

const SYMBOLS = {
    numbers: ["10", "11", "100", "111", "101", "010", "0110", "0", "1111", "1001"],
    letters: ["N", "M", "C", "D", "R", "U", "G", "O", "V", "W", "B"],
    faces: ["❤️", "👽", "⚽", "🎶", "🤖", "🦋", "🎈", "📙", "🍕", "🍎", "🚗"],
};

const LEVELS = ["Easy", "Medium", "Hard", "Expert"];
const LEVEL_SIZES = { Easy: 6, Medium: 10, Hard: 16, Expert: 20 };
const LEVEL_HELPS = { Easy: 0, Medium: 1, Hard: 2, Expert: 3 };

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

function Matching() {
    const navigate = useNavigate();

    const [symbolType, setSymbolType] = useState(null);
    const [levelIndex, setLevelIndex] = useState(0);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [helpsLeft, setHelpsLeft] = useState(0);

    // 🎮 Start game
    const startGame = (symbol, levelIdx = 0) => {
        const levelName = LEVELS[levelIdx];
        const size = LEVEL_SIZES[levelName];

        // 🔀 RANDOM symbols every game
        const randomSymbols = shuffleArray(SYMBOLS[symbol]).slice(0, size / 2);

        const deck = shuffleArray([...randomSymbols, ...randomSymbols]).map(
            (value, index) => ({ id: index, value })
        );

        setSymbolType(symbol);
        setLevelIndex(levelIdx);
        setCards(deck);
        setFlipped([]);
        setMatched([]);
        setLockBoard(false);
        setHasWon(false);
        setHelpsLeft(LEVEL_HELPS[levelName]);
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

    // 🆘 HELP → solve one random pair
    const useHelp = () => {
        if (helpsLeft === 0) return;

        const unmatchedIndexes = cards
            .map((c, i) => (matched.includes(i) ? null : i))
            .filter((i) => i !== null);

        if (unmatchedIndexes.length < 2) return;

        const first = unmatchedIndexes[Math.floor(Math.random() * unmatchedIndexes.length)];
        const pair = cards.findIndex(
            (c, i) => c.value === cards[first].value && i !== first
        );

        setMatched((prev) => [...prev, first, pair]);
        setHelpsLeft((prev) => prev - 1);
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

            // 🔓 Next level
            if (levelIndex < LEVELS.length - 1) {
                setTimeout(() => startGame(symbolType, levelIndex + 1), 1500);
            }
        }
    }, [matched]);

    // 🔁 Restart everything
    const restartGame = () => {
        const stored = JSON.parse(localStorage.getItem("games")) || [];
        const gameIndex = stored.findIndex((g) => g.title === "Memory Match");

        if (gameIndex >= 0) {
            stored[gameIndex].progress = 0;
            localStorage.setItem("games", JSON.stringify(stored));
            window.dispatchEvent(new Event("gamesUpdated"));
        }

        setSymbolType(null);
        setLevelIndex(0);
        setCards([]);
        setMatched([]);
        setFlipped([]);
        setHasWon(false);
    };

    return (
        <div className="container text-center mt-4">
            <h3>🧠 Memory Matching Game</h3>

            {!symbolType && (
                <>
                    <h3>Choose what you want to play with</h3>
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        <button className="btn" onClick={() => startGame("numbers")}>🔢 Numbers</button>
                        <button className="btn" onClick={() => startGame("letters")}>🔠 Letters</button>
                        <button className="btn" onClick={() => startGame("faces")}>😊 Faces</button>
                    </div>
                </>
            )}

            {symbolType && (
                <>
                    <h3>{hasWon ? "🎉 Level Complete!" : `Level: ${LEVELS[levelIndex]}`}</h3>
                    <h3>Helps left: {helpsLeft}</h3>

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

                    <div className="mt-4 d-flex justify-content-center gap-3">
                        {helpsLeft > 0 && (
                            <button className="btn" onClick={useHelp}>🆘 Help</button>
                        )}
                        <button className="btn" onClick={restartGame}>Restart Game</button>
                        <button className="btn" onClick={() => navigate("/")}>Leave</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Matching;
