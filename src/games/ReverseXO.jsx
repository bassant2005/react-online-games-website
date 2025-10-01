import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";

function ReverseXO() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player always X
  const [winner, setWinner] = useState(null);
  const [aiMode, setAiMode] = useState(false); // 🚀 false = easy, true = hard
  const navigate = useNavigate();

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

  // ✅ Misère condition: 3-in-a-row = you LOSE
  const checkWinner = (currentBoard) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        const loser = currentBoard[a];
        const winnerPlayer = loser === "X" ? "O" : "X";
        setWinner(winnerPlayer);

        // 🎉 If player wins (X), switch to hard AI
        if (winnerPlayer === "X" && !aiMode) {
          setAiMode(true);
          setTimeout(() => {
            resetGame(); // reset board for hard mode
          }, 1000);
        }
        return;
      }
    }

    if (currentBoard.every((cell) => cell !== null) && !winner) {
      setWinner("draw");
    }
  };

  // 🧠 Hard AI logic (Misère)
  const hardMove = (currentBoard) => {
    const emptyCells = currentBoard
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null);

    if (emptyCells.length === 0) return null;

    // 1️⃣ Try to force player into a losing move
    for (let idx of emptyCells) {
      const simBoard = [...currentBoard];
      simBoard[idx] = "O"; // AI move
      let forcesLoss = false;

      const playerMoves = simBoard
        .map((cell, i) => (cell === null ? i : null))
        .filter((i) => i !== null);

      for (let pm of playerMoves) {
        const testBoard = [...simBoard];
        testBoard[pm] = "X"; // simulate player move
        if (isWin(testBoard, "X")) {
          forcesLoss = true;
          break;
        }
      }

      if (forcesLoss) return idx;
    }

    // 2️⃣ Avoid creating a win for itself (O)
    for (let idx of emptyCells) {
      const simBoard = [...currentBoard];
      simBoard[idx] = "O";
      if (!isWin(simBoard, "O")) return idx;
    }

    // 3️⃣ Otherwise random
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  // ✅ Check win helper
  const isWin = (currentBoard, symbol) => {
    return winningCombos.some(([a, b, c]) => {
      return (
        currentBoard[a] === symbol &&
        currentBoard[b] === symbol &&
        currentBoard[c] === symbol
      );
    });
  };

  // 🤖 Computer move
  const computerMove = (currentBoard) => {
    const emptyCells = currentBoard
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null);

    if (emptyCells.length === 0) return;

    let moveIndex;
    if (aiMode) {
      moveIndex = hardMove(currentBoard);
    } else {
      moveIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const newBoard = [...currentBoard];
    newBoard[moveIndex] = "O";
    setBoard(newBoard);
    checkWinner(newBoard);
    setIsPlayerTurn(true);
  };

  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    checkWinner(newBoard);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        computerMove(board);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="tic-container text-center mt-4 ">
      <h2>Misère Tic Tac Toe ({aiMode ? "hard" : "easy"})</h2>
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
        {board.map((cell, idx) => (
          <div
            key={idx}
            className="square"
            onClick={() => handleClick(idx)}
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

export default ReverseXO;
