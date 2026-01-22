import React, { useState } from "react";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const LEVELS = {
    easy: 6,
    medium: 10,
    hard: 16,
};

function Matching() {
    const navigate = useNavigate();

    const [level, setLevel] = useState(null);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);

    // 🎲 Create & shuffle cards
    const startGame = (size) => {
        const pairs = size / 2;
        const values = Array.from({ length: pairs }, (_, i) => i + 1);

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

            const [first, second] = newFlipped;

            if (cards[first].value === cards[second].value) {
                setMatched((prev) => [...prev, first, second]);
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

    // 🎉 Win condition
    const hasWon = matched.length === cards.length && cards.length > 0;

    return (
        <div className="tic-container text-center mt-4">
            <h3>🃏 Memory Card Matching Game</h3>

            {!level && (
                <>
                    <p className="text-white-50 fst-italic">
                        Choose your level
                    </p>

                    <button className="gamesB" onClick={() => startGame(LEVELS.easy)}>
                        Easy (6 Cards)
                    </button>

                    <button className="gamesB ms-3" onClick={() => startGame(LEVELS.medium)}>
                        Medium (10 Cards)
                    </button>

                    <button className="gamesB ms-3" onClick={() => startGame(LEVELS.hard)}>
                        Hard (16 Cards)
                    </button>
                </>
            )}

            {level && (
                <>
                    <p className="text-white-50 fst-italic">
                        {hasWon ? "🎉 You matched all cards!" : "Flip two cards to find a match"}
                    </p>

                    <div
                        className="board"
                        style={{
                            gridTemplateColumns: `repeat(${Math.sqrt(level)}, 1fr)`,
                        }}
                    >
                        {cards.map((card, index) => (
                            <div
                                key={card.id}
                                className={`square ${
                                    flipped.includes(index) || matched.includes(index)
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleFlip(index)}
                            >
                                {flipped.includes(index) || matched.includes(index)
                                    ? card.value
                                    : "?"}
                            </div>
                        ))}
                    </div>

                    <div className="mt-3">
                        <button className="gamesB" onClick={() => setLevel(null)}>
                            Change Level
                        </button>

                        <button className="gamesB ms-3" onClick={() => startGame(level)}>
                            Restart
                        </button>

                        <button className="gamesB ms-3" onClick={() => navigate("/TicTacToe")}>
                            Leave
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Matching;
