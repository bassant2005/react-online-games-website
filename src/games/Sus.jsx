import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import moveSound from "../assets/sounds/move.mp3";
import computerSound from "../assets/sounds/computer.mp3";
import winSound from "../assets/sounds/win.wav";
import loseSound from "../assets/sounds/lose.wav";

function Sus() {
  const [board, setBoard] = useState(Array(9).fill(" "));
  const [winner, setWinner] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [scorePlayer, setScorePlayer] = useState(0);
  const [scoreComputer, setScoreComputer] = useState(0);
  const [mode, setMode] = useState("random"); // random = easy, ai = hard
  const navigate = useNavigate();

  const playerLetter = "S";
  const opponentLetter = "U";

  const [muted, setMuted] = useState(false);
  const [playMove] = useSound(moveSound, { soundEnabled: !muted });
  const [playComputer] = useSound(computerSound, { soundEnabled: !muted });
  const [playWin] = useSound(winSound, { soundEnabled: !muted });
  const [playLose] = useSound(loseSound, { soundEnabled: !muted });

  // ---------- Progress Logic ----------
  const updateProgress = () => {
    let gamesList = JSON.parse(localStorage.getItem("gamesList")) || [];
    let gamesProfile = JSON.parse(localStorage.getItem("games")) || [];

    // Mark SuS as won
    const index = gamesList.findIndex((g) => g.title === "Sus");
    if (index !== -1) {
      gamesList[index].win = true;
      localStorage.setItem("gamesList", JSON.stringify(gamesList));
    }

    // Update progress %
    const total = gamesList.length;
    const won = gamesList.filter(g => g.win).length;
    const percent = Math.round((won / total) * 100);

    const updatedGames = gamesProfile.map((g) =>
        g.title === "Sus" ? { ...g, progress: percent } : g
    );

    localStorage.setItem("games", JSON.stringify(updatedGames));
    window.dispatchEvent(new Event("gamesUpdated"));
  };

  // ---------- Game Logic ----------
  const checkSUS = (newBoard, pos, symbol) => {
    const row = Math.floor(pos / 3);
    const col = pos % 3;
    let susCount = 0;

    // row
    if (newBoard[row * 3] === "S" && newBoard[row * 3 + 1] === "U" && newBoard[row * 3 + 2] === "S")
      susCount++;
    // col
    if (newBoard[col] === "S" && newBoard[col + 3] === "U" && newBoard[col + 6] === "S")
      susCount++;
    // main diag
    if (row === col && newBoard[0] === "S" && newBoard[4] === "U" && newBoard[8] === "S")
      susCount++;
    // anti diag
    if (row + col === 2 && newBoard[2] === "S" && newBoard[4] === "U" && newBoard[6] === "S")
      susCount++;

    if (symbol === playerLetter) setScorePlayer(prev => prev + susCount);
    else setScoreComputer(prev => prev + susCount);
  };

  const isDraw = (newBoard) => newBoard.every(cell => cell !== " ");

  const handleClick = (index) => {
    if (board[index] !== " " || winner || !isPlayerTurn) return;
    const newBoard = [...board];
    newBoard[index] = playerLetter;
    setBoard(newBoard);
    playMove();
    checkSUS(newBoard, index, playerLetter);
    setIsPlayerTurn(false);
  };

  const getAIMove = (newBoard) => {
    if (mode === "random") {
      const emptyCells = newBoard.map((cell, idx) => (cell === " " ? idx : null)).filter(v => v !== null);
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else {
      // Hard AI: block or win
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
      const emptyCells = newBoard.map((cell, idx) => (cell === " " ? idx : null)).filter(v => v !== null);
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  };

  const checkImmediateSUS = (newBoard) => {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return combos.some(([a, b, c]) => newBoard[a] === "S" && newBoard[b] === "U" && newBoard[c] === "S");
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const move = getAIMove([...board]);
      if (move !== undefined) {
        const newBoard = [...board];
        newBoard[move] = opponentLetter;
        setTimeout(() => {
          setBoard(newBoard);
          playComputer();
          checkSUS(newBoard, move, opponentLetter);

          if (isDraw(newBoard)) setWinner("draw");
          else setIsPlayerTurn(true);
        }, 500);
      }
    }
  }, [isPlayerTurn, board, winner, mode, playComputer]);

  useEffect(() => {
    if (!winner && isDraw(board)) {
      if (scorePlayer > scoreComputer) {
        setWinner("player");
        playWin();

        // ✅ Progress update for easy mode
        if (mode === "random") updateProgress();
      } else if (scoreComputer > scorePlayer) {
        setWinner("computer");
        playLose();
      } else setWinner("tie");
    }
  }, [board, scorePlayer, scoreComputer, winner, playWin, playLose]);

  useEffect(() => {
    // After winning easy mode, unlock hard mode
    if (winner === "player" && mode === "random") {
      setTimeout(() => {
        setMode("ai");
        resetGame("ai");
      }, 700);
    }
  }, [winner, mode]);

  const resetGame = (newMode = mode) => {
    setBoard(Array(9).fill(" "));
    setWinner(null);
    setIsPlayerTurn(true);
    setScorePlayer(0);
    setScoreComputer(0);
    setMode(newMode);
  };

  return (
      <div className="tic-container text-center mt-4">
        <h3>
          Pyramid Tic Tac Toe<br />
          {mode === "random"
              ? "Let's start with the easy one"
              : "You opened the next game — try beating hard mode first!"}
        </h3>
        {/* 🔇 MUTE BUTTON */}
        <button className="btn btn-sm mb-3" onClick={() => setMuted(!muted)}>
          {muted ? "🔇 Muted" : "🔊 Sound On"}
        </button>
        <p className="text-white-50 fst-italic">
          {winner
              ? winner === "tie" ? "It's a Draw!" :
                  winner === "player" ? "🎉 You Win!" : "🤖 Computer Wins!"
              : isPlayerTurn ? "Your turn (S)" : "Computer's turn (U)"}
          <br />
          Player (S): {scorePlayer} / Computer (U): {scoreComputer}
        </p>

        <div className="board">
          {board.map((cell, idx) => (
              <div key={idx} className="square" onClick={() => handleClick(idx)}>
                {cell}
              </div>
          ))}
        </div>

        <div className="mt-3">
          <button className="gamesB" onClick={() => navigate("/TicTacToe")}>Leave</button>
          <button className="gamesB ms-3" onClick={() => resetGame(mode)}>Play Again</button>
        </div>
      </div>
  );
}

export default Sus;
