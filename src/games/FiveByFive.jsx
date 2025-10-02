import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function FiveByFive() {
  const [board, setBoard] = useState(Array(25).fill(null)); // 5x5 board
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [aiMode, setAiMode] = useState(false); // 🚀 start with easy mode
  const navigate = useNavigate();

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
          ) {
            return currentPlayer;
          }
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
          ) {
            return currentPlayer;
          }
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
          ) {
            return currentPlayer;
          }
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
          ) {
            return currentPlayer;
          }
        }
      }
    }
    return null;
  };

  // ---------------- EVALUATE BOARD ----------------
  const evaluateBoard = (b, depth) => {
    const result = checkWinner(b);
    if (result === "O") return 1000 - depth; // AI wins
    if (result === "X") return -1000 + depth; // Player wins
    return 0;
  };

  // ---------------- DRAW CHECK ----------------
  const isDraw = (b) => b.every((cell) => cell !== null);

  // ---------------- MINIMAX WITH ALPHA-BETA ----------------
  const minimax = (b, depth, isMaximizing, alpha, beta) => {
    const winnerCheck = checkWinner(b);
    if (winnerCheck || isDraw(b) || depth === 0) {
      return evaluateBoard(b, depth);
    }

    const emptySquares = b
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let move of emptySquares) {
        b[move] = "O"; // AI move
        const evalScore = minimax(b, depth - 1, false, alpha, beta);
        b[move] = null;
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break; // prune
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let move of emptySquares) {
        b[move] = "X"; // Player move
        const evalScore = minimax(b, depth - 1, true, alpha, beta);
        b[move] = null;
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break; // prune
      }
      return minEval;
    }
  };

  // ---------------- BEST MOVE ----------------
  const smartMove = (currentBoard) => {
    let bestValue = -Infinity;
    let bestMove = null;

    const emptySquares = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    for (let move of emptySquares) {
      currentBoard[move] = "O";
      const moveValue = minimax(currentBoard, 4, false, -Infinity, Infinity); // depth=4
      currentBoard[move] = null;

      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }

    return bestMove !== null
      ? bestMove
      : emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  // ---------------- COMPUTER MOVE ----------------
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timeout = setTimeout(() => {
        const emptySquares = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null);

        if (emptySquares.length > 0) {
          let moveIndex;
          if (aiMode) {
            moveIndex = smartMove([...board]);
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

  // ---------------- HANDLE CLICK ----------------
  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  // ---------------- WINNER EFFECT ----------------
  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);

      // 🎉 Unlock AI mode if player wins in easy mode
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
      setWinner("draw");
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(25).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="tic-container text-center mt-4">
      <h3>5x5 Tic Tac Toe <br/>
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
