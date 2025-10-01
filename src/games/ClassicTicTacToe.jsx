import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function ClassicTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [aiMode, setAiMode] = useState(false); // 🚀 starts as false (random)
  const navigate = useNavigate();
 
  // 🎯 Winning patterns
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // 🧠 Smart AI move
  const smartMove = (currentBoard) => {
    const emptySquares = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    // 1️⃣ Try to win
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] === "O" &&
        currentBoard[b] === "O" &&
        currentBoard[c] === null
      )
        return c;
      if (
        currentBoard[a] === "O" &&
        currentBoard[c] === "O" &&
        currentBoard[b] === null
      )
        return b;
      if (
        currentBoard[b] === "O" &&
        currentBoard[c] === "O" &&
        currentBoard[a] === null
      )
        return a;
    }

    // 2️⃣ Block player win
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] === "X" &&
        currentBoard[b] === "X" &&
        currentBoard[c] === null
      )
        return c;
      if (
        currentBoard[a] === "X" &&
        currentBoard[c] === "X" &&
        currentBoard[b] === null
      )
        return b;
      if (
        currentBoard[b] === "X" &&
        currentBoard[c] === "X" &&
        currentBoard[a] === null
      )
        return a;
    }

    // 3️⃣ Otherwise, pick random
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  // ✅ Computer move
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timeout = setTimeout(() => {
        const emptySquares = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null);

        if (emptySquares.length > 0) {
          let moveIndex;

          if (aiMode) {
            moveIndex = smartMove(board);
          } else {
            moveIndex =
              emptySquares[Math.floor(Math.random() * emptySquares.length)];
          }

          const newBoard = [...board];
          newBoard[moveIndex] = "O";
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isPlayerTurn, board, winner, aiMode]);

  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const checkWinner = () => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);

        // 🎉 If player wins → switch to AI mode and reset board
        if (board[a] === "X" && !aiMode) {
          setAiMode(true); // enable hard mode
          
          let games = JSON.parse(localStorage.getItem("gamesList")) || [];
          const index = games.findIndex((g) => g.title === "Tic Tac Toe");
          if (index !== -1) {
             games[index].win = true;
             localStorage.setItem("gamesList", JSON.stringify(games));
          }
          
          setTimeout(() => {
            setBoard(Array(9).fill(null));
            setWinner(null);
            setIsPlayerTurn(true);
          }, 700); 
        }
        return;
      }
    }

    if (board.every((cell) => cell !== null) && !winner) {
      setWinner("draw");
    }
  };

  useEffect(() => {
    checkWinner();
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    // ⚠️ Keep AI mode if it was activated
  };

  return (
    <div className="tic-container text-center mt-4">
      <h2>
        Classic Tic Tac Toe ({aiMode ? "hard" : "easy"})
      </h2>

      <p className="text-white-50 fst-italic">
        {winner
          ? winner === "draw"
            ? "It's a Draw!"
            : winner === "X"
            ? "🎉 You Win!"
            : "🤖 Computer Wins!"
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
