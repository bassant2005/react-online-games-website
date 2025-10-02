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

  // ✅ Check if a player made 3 in a row
  const isWin = (currentBoard, symbol) => {
    return winningCombos.some(([a, b, c]) => {
      return (
        currentBoard[a] === symbol &&
        currentBoard[b] === symbol &&
        currentBoard[c] === symbol
      );
    });
  };

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
          let games = JSON.parse(localStorage.getItem("gamesList")) || [];
          const index = games.findIndex((g) => g.title === "XO Special");
          if (index !== -1) {
             games[index].win = true;
             localStorage.setItem("gamesList", JSON.stringify(games));
          }

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

  // 🧠 Minimax algorithm for Misère Tic Tac Toe
  const minimax = (board, isMaximizing) => {
    if (isWin(board, "X")) return +10; // X made 3 -> O wins
    if (isWin(board, "O")) return -10; // O made 3 -> O loses
    if (board.every((cell) => cell !== null)) return 0; // draw

    const emptyCells = board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null);

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let idx of emptyCells) {
        const newBoard = [...board];
        newBoard[idx] = "O";
        let score = minimax(newBoard, false);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = +Infinity;
      for (let idx of emptyCells) {
        const newBoard = [...board];
        newBoard[idx] = "X";
        let score = minimax(newBoard, true);
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  // 🎯 Hard AI move
  const hardMove = (board) => {
    const emptyCells = board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null);

    let bestScore = -Infinity;
    let move = null;

    for (let idx of emptyCells) {
      const newBoard = [...board];
      newBoard[idx] = "O";
      let score = minimax(newBoard, false);
      if (score > bestScore) {
        bestScore = score;
        move = idx;
      }
    }
    return move;
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

  // 🎮 Player move
  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    checkWinner(newBoard);
    setIsPlayerTurn(false);
  };

  // ⏱️ Trigger AI when it's its turn
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        computerMove(board);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board]);

  // 🔄 Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="tic-container text-center mt-4 ">
      <h3>Misère Tic Tac Toe <br/>
      ({aiMode ? "You opend the next game now but don't leave try to bit the hard mode first !" 
      : "Let's start with the easy one"})
      </h3>
      
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
