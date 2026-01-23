import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import useSound from "use-sound";

function ClassicTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [aiMode, setAiMode] = useState(false);

  // 🔇 MUTE
  const [muted, setMuted] = useState(false);

  const navigate = useNavigate();

  // 🔊 SOUND EFFECTS
  const [playPlayerMove] = useSound("/sounds/move.mp3", {
    volume: 0.5,
    soundEnabled: !muted,
  });

  const [playComputerMove] = useSound("/sounds/computer.mp3", {
    volume: 0.5,
    soundEnabled: !muted,
  });

  const [playWin] = useSound("/sounds/win.wav", {
    volume: 0.7,
    soundEnabled: !muted,
  });

  const [playLose] = useSound("/sounds/lose.wav", {
    volume: 0.7,
    soundEnabled: !muted,
  });

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

  // 🧠 Smart AI
  const smartMove = (currentBoard) => {
    const emptySquares = currentBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter((val) => val !== null);

    // Try to win
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (currentBoard[a] === "O" && currentBoard[b] === "O" && currentBoard[c] === null) return c;
      if (currentBoard[a] === "O" && currentBoard[c] === "O" && currentBoard[b] === null) return b;
      if (currentBoard[b] === "O" && currentBoard[c] === "O" && currentBoard[a] === null) return a;
    }

    // Block player
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (currentBoard[a] === "X" && currentBoard[b] === "X" && currentBoard[c] === null) return c;
      if (currentBoard[a] === "X" && currentBoard[c] === "X" && currentBoard[b] === null) return b;
      if (currentBoard[b] === "X" && currentBoard[c] === "X" && currentBoard[a] === null) return a;
    }

    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  // 🤖 COMPUTER MOVE
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timeout = setTimeout(() => {
        const emptySquares = board
            .map((val, idx) => (val === null ? idx : null))
            .filter((val) => val !== null);

        if (emptySquares.length > 0) {
          const moveIndex = aiMode
              ? smartMove(board)
              : emptySquares[Math.floor(Math.random() * emptySquares.length)];

          const newBoard = [...board];
          newBoard[moveIndex] = "O";

          playComputerMove(); // 🤖 sound
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isPlayerTurn, board, winner, aiMode]);

  // 🧍 PLAYER MOVE
  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;

    playPlayerMove(); // 🧍 sound

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  // 🏆 CHECK WINNER
  const checkWinner = () => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);

        if (board[a] === "X") {
          playWin();
        } else {
          playLose();
        }

        if (board[a] === "X" && !aiMode) {
          setAiMode(true);

          let games = JSON.parse(localStorage.getItem("gamesList")) || [];
          const index = games.findIndex((g) => g.title === "Tic Tac Toe");

          if (index !== -1) {
            games[index].win = true;
            localStorage.setItem("gamesList", JSON.stringify(games));
            window.dispatchEvent(new Event("gamesUpdated"));
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
      setWinner("draw"); // ❌ no sound
    }
  };

  useEffect(() => {
    checkWinner();
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
      <div className="tic-container text-center mt-4">
        <h3>
          Classic Tic Tac Toe <br />
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
