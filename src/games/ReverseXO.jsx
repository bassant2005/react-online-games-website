import React, { useState, useEffect } from "react";
import "./tictactoe.css";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import playerMoveSound from "./sounds/player-move.mp3";
import computerMoveSound from "./sounds/computer-move.mp3";
import winSound from "./sounds/win.mp3";
import loseSound from "./sounds/lose.mp3";

function ReverseXO() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player = X
  const [winner, setWinner] = useState(null);
  const [aiMode, setAiMode] = useState(false); // false = easy, true = hard
  const navigate = useNavigate();

  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // Sounds
  const [playPlayer] = useSound(playerMoveSound);
  const [playComputer] = useSound(computerMoveSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);

  const isWin = (currentBoard, symbol) => {
    return winningCombos.some(([a,b,c]) => currentBoard[a] === symbol && currentBoard[b] === symbol && currentBoard[c] === symbol);
  };

  const checkWinner = (currentBoard) => {
    for (let [a,b,c] of winningCombos) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        const loser = currentBoard[a];
        const winnerPlayer = loser === "X" ? "O" : "X";
        setWinner(winnerPlayer);
        winnerPlayer === "X" ? playWin() : playLose();

        if (winnerPlayer === "X" && !aiMode) {
          setAiMode(true);
          setTimeout(() => resetGame(), 1000);
        }
        return;
      }
    }
    if (currentBoard.every(cell => cell !== null) && !winner) setWinner("draw");
  };

  // Minimax for hard AI
  const minimax = (board, isMaximizing) => {
    if (isWin(board, "X")) return +10;
    if (isWin(board, "O")) return -10;
    if (board.every(cell => cell !== null)) return 0;

    const emptyCells = board.map((c,i) => c === null ? i : null).filter(i => i !== null);

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let idx of emptyCells) {
        const newBoard = [...board]; newBoard[idx] = "O";
        let score = minimax(newBoard, false);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let idx of emptyCells) {
        const newBoard = [...board]; newBoard[idx] = "X";
        let score = minimax(newBoard, true);
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  const hardMove = (board) => {
    const emptyCells = board.map((c,i) => c === null ? i : null).filter(i => i !== null);
    let bestScore = -Infinity;
    let move = null;

    for (let idx of emptyCells) {
      const newBoard = [...board]; newBoard[idx] = "O";
      let score = minimax(newBoard, false);
      if (score > bestScore) {
        bestScore = score;
        move = idx;
      }
    }
    return move;
  };

  const computerMove = (currentBoard) => {
    const emptyCells = currentBoard.map((c,i) => c === null ? i : null).filter(i => i !== null);
    if (emptyCells.length === 0) return;
    let moveIndex = aiMode ? hardMove(currentBoard) : emptyCells[Math.floor(Math.random()*emptyCells.length)];

    const newBoard = [...currentBoard];
    newBoard[moveIndex] = "O";
    setTimeout(() => {
      setBoard(newBoard);
      playComputer();
      checkWinner(newBoard);
      setIsPlayerTurn(true);
    }, 500);
  };

  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner) return;
    const newBoard = [...board]; newBoard[index] = "X";
    setBoard(newBoard);
    playPlayer();
    checkWinner(newBoard);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => computerMove(board), 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board, aiMode]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
      <div className="tic-container text-center mt-4">
        <h3>Misère Tic Tac Toe ({aiMode ? "Hard Mode" : "Easy Mode"})</h3>
        <p className="text-white-50 fst-italic">
          {winner
              ? winner === "draw" ? "It's a Draw!" :
                  winner === "X" ? "🎉 You Win!" : "🤖 Computer Wins!"
              : isPlayerTurn ? "Your turn (X)" : "Computer's turn (O)"}
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
          <button className="gamesB ms-3" onClick={resetGame}>Play Again</button>
        </div>
      </div>
  );
}

export default ReverseXO;
