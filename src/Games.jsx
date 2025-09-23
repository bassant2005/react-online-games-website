import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles.css";
import "./games.css";
import Game from "./Game";

import ticTacToeImg from "./assets/tictactoe.jfif";
import wordleImg from "./assets/wordle.jfif";
import hangmanImg from "./assets/hangman.jfif";
import sudokuImg from "./assets/sudoku.jfif";
import chessImg from "./assets/chess.jfif";
import minesweeperImg from "./assets/minesweeper.jfif";
import snakeImg from "./assets/snake.jfif";
import connectFourImg from "./assets/connectfour.jfif";  
import wordSearchImg from "./assets/wordsearch.jfif";     
import kenkenImg from "./assets/kenken.jfif";             
import memoryMatchImg from "./assets/memorymatch.jfif";   
import checkersImg from "./assets/checkers.jfif";         

// 🎮 Game data arrays (unique + updated images)
const gamesList = [
  { img: ticTacToeImg, title: "Tic Tac Toe", desc: "Classic X vs O strategy game" },
  { img: wordleImg, title: "Wordle", desc: "Guess the hidden word in 6 tries" },
  { img: hangmanImg, title: "Hangman", desc: "Save the stickman by guessing letters" },
  { img: sudokuImg, title: "Sudoku", desc: "Fill the grid with numbers 1-9 logically" },
  { img: chessImg, title: "Chess", desc: "Strategic board game of kings and queens" },
  { img: minesweeperImg, title: "Minesweeper", desc: "Avoid the mines and clear the grid" },
  { img: snakeImg, title: "Snake", desc: "Grow the snake without hitting walls" },
  { img: connectFourImg, title: "Connect Four", desc: "Line up 4 discs before your opponent" },
  { img: wordSearchImg, title: "Word Search", desc: "Find hidden words in a letter grid" },
  { img: kenkenImg, title: "KenKen", desc: "Math-based grid puzzle game" },
  { img: memoryMatchImg, title: "Memory Match", desc: "Match pairs of cards using memory" },
  { img: checkersImg, title: "Checkers", desc: "Classic strategy board game with jumps" },
  { img: ticTacToeImg, title: "Tic Tac Toe", desc: "Classic X vs O strategy game" },
  { img: wordleImg, title: "Wordle", desc: "Guess the hidden word in 6 tries" },
  { img: hangmanImg, title: "Hangman", desc: "Save the stickman by guessing letters" },
  { img: sudokuImg, title: "Sudoku", desc: "Fill the grid with numbers 1-9 logically" },
  { img: chessImg, title: "Chess", desc: "Strategic board game of kings and queens" },
  { img: minesweeperImg, title: "Minesweeper", desc: "Avoid the mines and clear the grid" },
  { img: snakeImg, title: "Snake", desc: "Grow the snake without hitting walls" },
  { img: connectFourImg, title: "Connect Four", desc: "Line up 4 discs before your opponent" },
  { img: wordSearchImg, title: "Word Search", desc: "Find hidden words in a letter grid" },
  { img: kenkenImg, title: "KenKen", desc: "Math-based grid puzzle game" },
  { img: memoryMatchImg, title: "Memory Match", desc: "Match pairs of cards using memory" },
  { img: checkersImg, title: "Checkers", desc: "Classic strategy board game with jumps" },
  { img: ticTacToeImg, title: "Tic Tac Toe", desc: "Classic X vs O strategy game" },
  { img: wordleImg, title: "Wordle", desc: "Guess the hidden word in 6 tries" },
  { img: hangmanImg, title: "Hangman", desc: "Save the stickman by guessing letters" },
  { img: sudokuImg, title: "Sudoku", desc: "Fill the grid with numbers 1-9 logically" },
  { img: chessImg, title: "Chess", desc: "Strategic board game of kings and queens" },
  { img: minesweeperImg, title: "Minesweeper", desc: "Avoid the mines and clear the grid" },
  { img: snakeImg, title: "Snake", desc: "Grow the snake without hitting walls" },
  { img: connectFourImg, title: "Connect Four", desc: "Line up 4 discs before your opponent" },
  { img: wordSearchImg, title: "Word Search", desc: "Find hidden words in a letter grid" },
  { img: kenkenImg, title: "KenKen", desc: "Math-based grid puzzle game" },
  { img: memoryMatchImg, title: "Memory Match", desc: "Match pairs of cards using memory" },
  { img: checkersImg, title: "Checkers", desc: "Classic strategy board game with jumps" },
];

// 🎮 Reusable Card Component
function GameCard({ img, title, desc, index }) {
  const modalId = `gameModal-${index}`;
  const game = { img, title, desc };

  return (
    <>
      <div className="col-4 col-sm-4 col-md-3 col-lg-2 mb-3 mt-2 games">
        <div className="box card">
          <img src={img} className="img-fluid" alt={title} />
          <div className="overlay">
            <p>
              {title} - {desc}
            </p>
            <a
              href="#"
              className="btn-link"
              data-bs-toggle="modal"
              data-bs-target={`#${modalId}`}
            >
              Explore
            </a>
          </div>
        </div>
      </div>

      {/* ✅ Modal instance for this card */}
      <Game game={game} modalId={modalId} />
    </>
  );
}

function Games() {
  return (
    <>
      {/* 🎮 Games Section */}
      <div id="games" className="games text-center pt-4 pb-4">
        <div className="container">
          <div className="main-title mt-3 mb-4 position-relative">
            <h2>let's have a new journey!</h2>
            <p className="text-white-50 fst-italic">pick one of these games</p>
          </div>

          <div className="row d-flex justify-content-center">
            {gamesList.map((game, index) => (
              <GameCard key={index} {...game} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Games;
