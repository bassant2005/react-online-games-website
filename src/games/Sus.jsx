import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";

function Sus() {
  const [board, setBoard] = useState(Array(9).fill(" "));
  const [winner, setWinner] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [scorePlayer, setScorePlayer] = useState(0);
  const [scoreComputer, setScoreComputer] = useState(0);
  const [mode, setMode] = useState("random");
  const navigate = useNavigate();

  const playerLetter = "S";
  const opponentLetter = "U";

  // ✅ Check if a SUS is formed
  const checkSUS = (newBoard, pos, symbol) => {
    const row = Math.floor(pos / 3);
    const col = pos % 3;
    let susCount = 0;

    // row
    if (
      newBoard[row * 3] === "S" &&
      newBoard[row * 3 + 1] === "U" &&
      newBoard[row * 3 + 2] === "S"
    ) {
      susCount++;
    }
    // col
    if (
      newBoard[col] === "S" &&
      newBoard[col + 3] === "U" &&
      newBoard[col + 6] === "S"
    ) {
      susCount++;
    }
    // main diag
    if (row === col) {
      if (newBoard[0] === "S" && newBoard[4] === "U" && newBoard[8] === "S") {
        susCount++;
      }
    }
    // anti diag
    if (row + col === 2) {
      if (newBoard[2] === "S" && newBoard[4] === "U" && newBoard[6] === "S") {
        susCount++;
      }
    }

    if (symbol === playerLetter) {
      setScorePlayer((prev) => prev + susCount);
    } else {
      setScoreComputer((prev) => prev + susCount);
    }
  };

  // ✅ Check if board is full
  const isDraw = (newBoard) => newBoard.every((cell) => cell !== " ");

  // ✅ Player move
  const handleClick = (index) => {
    if (board[index] !== " " || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = playerLetter;
    setBoard(newBoard);
    checkSUS(newBoard, index, playerLetter);
    setIsPlayerTurn(false);
  };

  // ✅ AI Move (Random + Hard)
  const getAIMove = (newBoard) => {
    if (mode === "random") {
      const emptyCells = newBoard
        .map((cell, idx) => (cell === " " ? idx : null))
        .filter((val) => val !== null);
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } 
    else {
      // Hard AI: try win → block → random
      for (let symbol of [opponentLetter, playerLetter]) {
        for (let i = 0; i < 9; i++) {
          if (newBoard[i] === " ") {
            newBoard[i] = symbol;
            if (checkImmediateSUS(newBoard)) {
              newBoard[i] = " ";
              return i;
            }
            newBoard[i] = " ";
          }
        }
      }

      const emptyCells = newBoard
        .map((cell, idx) => (cell === " " ? idx : null))
        .filter((val) => val !== null);
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  };

  // ✅ Simple check for SUS (used by AI)
  const checkImmediateSUS = (newBoard) => {
    const combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return combos.some(
      ([a, b, c]) =>
        newBoard[a] === "S" && newBoard[b] === "U" && newBoard[c] === "S"
    );
  };

  // ✅ Computer move logic
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const move = getAIMove([...board]);
      if (move !== undefined) {
        const newBoard = [...board];
        newBoard[move] = opponentLetter;
        setTimeout(() => {
          setBoard(newBoard);
          checkSUS(newBoard, move, opponentLetter);

          if (isDraw(newBoard)) {
            setWinner("draw");
          } else {
            setIsPlayerTurn(true);
          }
        }, 500);
      }
    }
  }, [isPlayerTurn, board, winner, mode]);

  // ✅ Switch to AI mode if player wins easy mode
  useEffect(() => {
    if (winner === "player" && mode === "random") {
      let games = JSON.parse(localStorage.getItem("gamesList")) || [];
      const index = games.findIndex((g) => g.title === "Sus");
      if (index !== -1) {
        games[index].win = true; // ✅ mark as won
        localStorage.setItem("gamesList", JSON.stringify(games));
      }
      setTimeout(() => {
        resetGame("ai"); // ✅ switch and reset into Hard mode
      }, 700);
    }
  }, [winner, mode]);

  // ✅ Detect winner when board fills
  useEffect(() => {
    if (!winner && isDraw(board)) {
      if (scorePlayer > scoreComputer) {
        setWinner("player");
      } 
      else if (scoreComputer > scorePlayer) {
        setWinner("computer");
      } 
      else {
        setWinner("tie");
      }
    }
  }, [board, scorePlayer, scoreComputer, winner, mode]);

  // ✅ Restart game (back to random)
  const resetGame = (newMode = mode) => {
    setBoard(Array(9).fill(" "));
    setWinner(null);
    setIsPlayerTurn(true);
    setScorePlayer(0);
    setScoreComputer(0);
    setMode(newMode); // ✅ keep or change based on parameter
  };

  return (
    <div className="tic-container text-center mt-4">
      <h2>SuS Tic Tac Toe ({mode === "random" ? "Easy" : "Hard"})</h2>
      <p className="text-white-50 fst-italic">
        {winner
          ? winner === "tie"
            ? "It's a Draw!"
            : winner === "player"
            ? "🎉 You Win!"
            : "🤖 Computer Wins!"
          : isPlayerTurn
          ? "Your turn (X)"
          : "Computer's turn (O)"}
        <br />
        Player (S): {scorePlayer}
        <br />
        Computer (U): {scoreComputer}
        <br />
      </p>
      <div className="board">
        {board.map((cell, idx) => (
          <div key={idx} className="square" onClick={() => handleClick(idx)}>
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

export default Sus;
