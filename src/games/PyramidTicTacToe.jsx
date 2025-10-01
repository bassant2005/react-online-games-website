import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import useProgress from "./XOprogress";
import { useNavigate } from "react-router-dom";

// ---------- Board Setup ----------
const initialBoard = () => {
  const board = Array(3)
    .fill(null)
    .map(() => Array(5).fill(" "));

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 5; j++) {
      if (
        (i === 0 && (j === 0 || j === 1 || j === 3 || j === 4)) ||
        (i === 1 && (j === 0 || j === 4))
      ) {
        continue;
      }
      board[i][j] = ""; // ✅ make playable cells empty
    }
  }
  return board;
};

// ---------- Game Logic ----------
function checkWin(board, symbol) {
  // col
  if (board[0][2] === symbol && board[1][2] === symbol && board[2][2] === symbol) return true;
  // rows
  if (board[1][1] === symbol && board[1][2] === symbol && board[1][3] === symbol) return true;
  if (board[2][0] === symbol && board[2][1] === symbol && board[2][2] === symbol) return true;
  if (board[2][1] === symbol && board[2][2] === symbol && board[2][3] === symbol) return true;
  if (board[2][2] === symbol && board[2][3] === symbol && board[2][4] === symbol) return true;
  // diagonals
  if (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol) return true;
  if (board[0][2] === symbol && board[1][3] === symbol && board[2][4] === symbol) return true;

  return false;
}

function isDraw(board) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 5; j++) {
      if (board[i][j] !== "X" && board[i][j] !== "O" && board[i][j] !== " ") {
        return false;
      }
    }
  }
  return true;
}

// ---------- AI Logic (Minimax) ----------
function minimax(board, depth, isMaximizing) {
  if (checkWin(board, "O")) return 100;
  if (checkWin(board, "X")) return -100;
  if (isDraw(board) || depth === 0) return 0;

  if (isMaximizing) {
    let best = -1000;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        if (board[i][j] !== "X" && board[i][j] !== "O" && board[i][j] !== " ") {
          const temp = board[i][j];
          board[i][j] = "O";
          best = Math.max(best, minimax(board, depth - 1, false));
          board[i][j] = temp;
        }
      }
    }
    return best;
  } else {
    let best = 1000;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        if (board[i][j] !== "X" && board[i][j] !== "O" && board[i][j] !== " ") {
          const temp = board[i][j];
          board[i][j] = "X";
          best = Math.min(best, minimax(board, depth - 1, true));
          board[i][j] = temp;
        }
      }
    }
    return best;
  }
}

function getBestMove(board) {
  let bestScore = -1000;
  let bestMove = null;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 5; j++) {
      if (board[i][j] !== "X" && board[i][j] !== "O" && board[i][j] !== " ") {
        const temp = board[i][j];
        board[i][j] = "O";
        let score = minimax(board, 4, false);
        board[i][j] = temp;

        if (score > bestScore) {
          bestScore = score;
          bestMove = [i, j];
        }
      }
    }
  }
  return bestMove;
}

// ---------- Component ----------
export default function PyramidTicTacToe() {
  const [progress, setProgress] = useProgress(); // ✅ link with XOprogress.js
  const [board, setBoard] = useState(initialBoard());
  const [turn, setTurn] = useState("X");
  const [mode, setMode] = useState("random"); // ✅ start in easy mode
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  const handleClick = (i, j) => {
    if (winner || board[i][j] === "X" || board[i][j] === "O" || board[i][j] === " ") return;

    const newBoard = board.map((row) => [...row]);
    newBoard[i][j] = turn;
    setBoard(newBoard);

    if (checkWin(newBoard, turn)) {
      setWinner(turn);
      if (turn === "X" && mode === "random") {
        let games = JSON.parse(localStorage.getItem("gamesList")) || [];
        const index = games.findIndex((g) => g.title === "Pyramid Tic Tac Toe");
        if (index !== -1) {
          games[index].win = true; // ✅ mark as won
          localStorage.setItem("gamesList", JSON.stringify(games));
        }
      }
    } else if (isDraw(newBoard)) {
      setWinner("draw");
    } else {
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  // Computer Move
  useEffect(() => {
    if ((mode === "random" || mode === "ai") && turn === "O" && !winner) {
      const newBoard = board.map((row) => [...row]);

      let move;
      if (mode === "random") {
        const available = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 5; j++) {
            if (newBoard[i][j] !== "X" && newBoard[i][j] !== "O" && newBoard[i][j] !== " ") {
              available.push([i, j]);
            }
          }
        }
        move = available[Math.floor(Math.random() * available.length)];
      } else {
        move = getBestMove(newBoard);
      }

      if (move) {
        const [i, j] = move;
        newBoard[i][j] = "O";
        setTimeout(() => {
          setBoard(newBoard);
          if (checkWin(newBoard, "O")) {
            setWinner("O");
          } else if (isDraw(newBoard)) {
            setWinner("draw");
          } else {
            setTurn("X");
          }
        }, 500);
      }
    }
  }, [turn, mode, board, winner]);

  const resetGame = () => {
    setBoard(initialBoard());
    setTurn("X");
    setWinner(null);
  };

  // ✅ Switch to AI mode if player wins easy mode
  useEffect(() => {
    if (winner === "X" && mode === "random") {
      setTimeout(() => {
        setMode("ai");
        resetGame();
      }, 700);
    }
  }, [winner, mode]);

  return (
    <div className="pyramid">
      <h2>Pyramid Tic Tac Toe ({mode === "random" ? "Easy" : "Hard"})</h2>
      <p className="text-white-50 fst-italic">
        {winner
          ? winner === "draw"
          ? "It's a Draw!"
          : winner === "X"
          ? "🎉 You Win!"
          : "🤖 Computer Wins!"
          : turn === "X"
          ? "Your turn (X)"
          : "Computer's turn (O)"}
      </p>

      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`cell ${cell === " " ? "empty" : ""}`}
                onClick={() => handleClick(i, j)}
              >
                {cell}
              </div>
            ))}
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
