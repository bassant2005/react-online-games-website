import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles.css";
import "../games.css";
import "./matching.css";

const SYMBOLS = {
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8"],
    letters: ["A", "B", "C", "D", "E", "F", "G", "H"],
    faces: [
        "fa-thin fa-face-grin-stars",
        "fa-thin fa-face-grin-hearts",
        "fa-thin fa-face-grin-wink",
        "fa-thin fa-face-rolling-eyes",
        "fa-thin fa-face-laugh-beam",
        "fa-thin fa-face-grin-tears",
        "fa-thin fa-face-grin-tongue-wink",
        "fa-thin fa-face-angry",
    ],
};

function Matching() {
    const navigate = useNavigate();

    const [symbolType, setSymbolType] = useState(null);
    const [level, setLevel] = useState(null);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);

    const startGame = (size) => {
        const values = SYMBOLS[symbolType].slice(0, size / 2);

        const deck = [...values, ...values]
            .sort(() => Math.random() - 0.5)
            .map((value, index) => ({
                id: index,
                value,
            }));

        setLevel(size);
        setCards(deck);
        setFlipped([]);
        setMatched([]);
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

    const hasWon = matched.length === cards.length && cards.length > 0;

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
                        <button className="btn" onClick={() => startGame(6)}>Easy</button>
                        <button className="btn" onClick={() => startGame(10)}>Medium</button>
                        <button className="btn" onClick={() => startGame(16)}>Hard</button>
                    </div>
                </>
            )}

            {/* GAME BOARD */}
            {level && (
                <>
                    <h3>
                        {hasWon ? "🎉 You matched all cards!" : "Flip two cards"}
                    </h3>

                    <div className="justify-content-center g-3">
                        {cards.map((card, index) => (
                            <div key={card.id} className="col-4 col-md-3 col-lg-2">
                                <div
                                    className={`shadow text-center ${
                                        flipped.includes(index) || matched.includes(index)
                                            ? "border-success"
                                            : ""
                                    }`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleFlip(index)}
                                >
                                    <div className="box fs-2">
                                        {flipped.includes(index) || matched.includes(index) ? (
                                            symbolType === "faces" ? (
                                                <i className={`fa-solid ${card.value}`}></i>
                                            ) : (
                                                card.value
                                            )
                                        ) : (
                                            <i className="fa-solid fa-question"></i>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CONTROLS */}
                    <div className="mt-4 d-flex justify-content-center gap-3">
                        <button className="btn" onClick={() => setLevel(null)}>
                            Change Level
                        </button>
                        <button className="btn" onClick={() => startGame(level)}>
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
