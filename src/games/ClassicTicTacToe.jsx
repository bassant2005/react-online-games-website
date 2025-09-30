import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import useProgress from "./XOprogress";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function ClassicTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null)); // 3x3 board
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // random later
  const [winner, setWinner] = useState(null);
  const [progress, setProgress] = useProgress();
  const navigate = useNavigate();

  // 🎯 Winning patterns
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  // ✅ Check winner after each move
  useEffect(() => {
    checkWinner();
  }, [board]);

  // 🤖 Computer move (random available square)
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timeout = setTimeout(() => {
        const emptySquares = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null);

        if (emptySquares.length > 0) {
          const randomIndex =
            emptySquares[Math.floor(Math.random() * emptySquares.length)];

          const newBoard = [...board];
          newBoard[randomIndex] = "O"; // computer always O
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
      }, 500); // delay to feel natural
      return () => clearTimeout(timeout);
    }
  }, [isPlayerTurn, board, winner]);

  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = "X"; // player always X
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const checkWinner = () => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);

        // ✅ Only increase progress if player (X) wins AND hasn't unlocked this yet
        if (board[a] === "X" && progress < 20) {
          const newProgress = 20;
          setProgress(newProgress);

          // ✅ Update in games list (localStorage)
          let games = JSON.parse(localStorage.getItem("games")) || [];
          const index = games.findIndex(g => g.title === "Tic Tac Toe");
          if (index !== -1) {
            games[index].progress = newProgress;
            localStorage.setItem("games", JSON.stringify(games));
          }
        }

        return;
      }
    }

    if (board.every((cell) => cell !== null) && !winner) {
      setWinner("draw");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true); // ✅ Player (X) always starts
  };

  return (
    <div className="tic-container text-center mt-4">
      <h2>Classic Tic Tac Toe</h2>
      <p className="text-white-50 fst-italic">
        {winner
          ? winner === "draw"
            ? "It's a draw!"
            : `${winner} wins!`
          : isPlayerTurn
          ? "Your turn (X)"
          : "Computer's turn (O)"}
      </p>

      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className="square"
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <button className="gamesB" onClick={() => navigate("/TicTacToe")}>
          Leave
        </button>
        <button onClick={resetGame} className="gamesB ms-3">
          Play Again
        </button>
      </div>
    </div>
  );
}

export default ClassicTicTacToe;
