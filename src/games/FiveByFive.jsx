import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import useSound from "use-sound";
import moveSound from "../assets/sounds/move.mp3";
import computerSound from "../assets/sounds/computer.mp3";
import winSound from "../assets/sounds/win.wav";
import loseSound from "../assets/sounds/lose.wav";

function FiveByFive() {
  const [board, setBoard] = useState(Array(25).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [aiMode, setAiMode] = useState(false);
  const navigate = useNavigate();

  // 🔇 MUTE
  const [muted, setMuted] = useState(false);
  const [playMove] = useSound(moveSound, { soundEnabled: !muted });
  const [playComputer] = useSound(computerSound, { soundEnabled: !muted });
  const [playWin] = useSound(winSound, { soundEnabled: !muted });
  const [playLose] = useSound(loseSound, { soundEnabled: !muted });

  // ---------------- CHECK WINNER ----------------
  const checkWinner = (b) => {
    const players = ["X", "O"];
    for (let currentPlayer of players) {
      // Horizontal
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= 1; col++) {
          if (
              b[row * 5 + col] === currentPlayer &&
              b[row * 5 + col] === b[row * 5 + col + 1] &&
              b[row * 5 + col] === b[row * 5 + col + 2] &&
              b[row * 5 + col] === b[row * 5 + col + 3]
          ) return currentPlayer;
        }
      }

      // Vertical
      for (let col = 0; col < 5; col++) {
        for (let row = 0; row <= 1; row++) {
          if (
              b[row * 5 + col] === currentPlayer &&
              b[row * 5 + col] === b[(row + 1) * 5 + col] &&
              b[row * 5 + col] === b[(row + 2) * 5 + col] &&
              b[row * 5 + col] === b[(row + 3) * 5 + col]
          ) return currentPlayer;
        }
      }

      // Diagonal ↘
      for (let row = 0; row <= 1; row++) {
        for (let col = 0; col <= 1; col++) {
          if (
              b[row * 5 + col] === currentPlayer &&
              b[row * 5 + col] === b[(row + 1) * 5 + (col + 1)] &&
              b[row * 5 + col] === b[(row + 2) * 5 + (col + 2)] &&
              b[row * 5 + col] === b[(row + 3) * 5 + (col + 3)]
          ) return currentPlayer;
        }
      }

      // Diagonal ↙
      for (let row = 0; row <= 1; row++) {
        for (let col = 3; col < 5; col++) {
          if (
              b[row * 5 + col] === currentPlayer &&
              b[row * 5 + col] === b[(row + 1) * 5 + (col - 1)] &&
              b[row * 5 + col] === b[(row + 2) * 5 + (col - 2)] &&
              b[row * 5 + col] === b[(row + 3) * 5 + (col - 3)]
          ) return currentPlayer;
        }
      }
    }
    return null;
  };

  const isDraw = (b) => b.every((cell) => cell !== null);

  // ---------------- MINIMAX ----------------
  const minimax = (b, depth, isMax, alpha, beta) => {
    const result = checkWinner(b);
    if (result === "O") return 1000 - depth;
    if (result === "X") return -1000 + depth;
    if (isDraw(b) || depth === 0) return 0;

    const emptySquares = b
        .map((val, idx) => (val === null ? idx : null))
        .filter((val) => val !== null);

    if (isMax) {
      let maxEval = -Infinity;
      for (let move of emptySquares) {
        b[move] = "O";
        const evalScore = minimax(b, depth - 1, false, alpha, beta);
        b[move] = null;
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let move of emptySquares) {
        b[move] = "X";
        const evalScore = minimax(b, depth - 1, true, alpha, beta);
        b[move] = null;
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  const smartMove = (currentBoard) => {
    let bestValue = -Infinity;
    let bestMove = null;

    const emptySquares = currentBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter((val) => val !== null);

    for (let move of emptySquares) {
      currentBoard[move] = "O";
      const moveValue = minimax(currentBoard, 4, false, -Infinity, Infinity);
      currentBoard[move] = null;

      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }

    return bestMove ?? emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  // ---------------- COMPUTER MOVE ----------------
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timeout = setTimeout(() => {
        const emptySquares = board
            .map((val, idx) => (val === null ? idx : null))
            .filter((val) => val !== null);

        if (emptySquares.length > 0) {
          const moveIndex = aiMode
              ? smartMove([...board])
              : emptySquares[Math.floor(Math.random() * emptySquares.length)];

          const newBoard = [...board];
          newBoard[moveIndex] = "O";

          playComputer(); // 🤖
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isPlayerTurn, board, winner, aiMode]);

  // ---------------- PLAYER MOVE ----------------
  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;

    playMove(); // 🧍

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  // ---------------- WIN EFFECT ----------------
  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);

      if (result === "X") {
        playWin();
      } else {
        playLose();
      }

      if (result === "X" && !aiMode) {
        setAiMode(true);

        let games = JSON.parse(localStorage.getItem("gamesList")) || [];
        const index = games.findIndex((g) => g.title === "5x5 Grid");
        if (index !== -1) {
          games[index].win = true;
          localStorage.setItem("gamesList", JSON.stringify(games));
        }

        setTimeout(() => {
          setBoard(Array(25).fill(null));
          setWinner(null);
          setIsPlayerTurn(true);
        }, 700);
      }
    } else if (isDraw(board) && !winner) {
      setWinner("draw"); // ❌ no sound
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(25).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
      <div className="tic-container text-center mt-4">
        <h3>
          5x5 Tic Tac Toe <br />
          ({aiMode
            ? "You opened the next game — try beating hard mode first!"
            : "Let's start with the easy one"})
        </h3>

        {/* 🔇 MUTE */}
        <button className="btn btn-sm mb-2" onClick={() => setMuted(!muted)}>
          {muted ? "🔇 Muted" : "🔊 Sound On"}
        </button>

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

        <div className="board5">
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

export default FiveByFive;
