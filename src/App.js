import React, { useState, useEffect } from "react";
import { findWinningLine, winningLines } from "./utils/winningLines";
import { playerMessages, computerMessages } from "./utils/winningMessages";
import { computeGameStatus } from "./utils/gameUtils";
import "./App.css";

const BOARD_SIZE = 3;

function App() {
  const [squares, setSquares] = useState(
    Array(BOARD_SIZE * BOARD_SIZE).fill(null)
  );
  const [isNewGame, setIsNewGame] = useState(true);
  const [audioError, setAudioError] = useState(null);
  const [xIsNext, setXIsNext] = useState(Math.random() < 0.5);
  const [playerWins, setPlayerWins] = useState(
    parseInt(localStorage.getItem("playerWins"), 10) || 0
  );
  const [computerWins, setComputerWins] = useState(
    parseInt(localStorage.getItem("computerWins"), 10) || 0
  );

  const X_SYMBOL = "🐺";
  const O_SYMBOL = "🐷";
  const MIN_DELAY = 300;
  const MAX_DELAY = 1700;
  const MESSAGE_DURATION = 5000;

  const [currentMessage, setCurrentMessage] = useState("");

  const [showMessage, setShowMessage] = useState({
    player: false,
    computer: false,
  });

  const getRandomMessage = (isPlayerWinner) => {
    const messages = isPlayerWinner ? playerMessages : computerMessages;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const handleResetScore = () => {
    setPlayerWins(0);
    setComputerWins(0);

    localStorage.setItem("playerWins", 0);
    localStorage.setItem("computerWins", 0);
  };

  useEffect(() => {
    const { winner } = findWinningLine(squares) || {};

    // If there is a winner, show the message and update the win count
    if (winner) {
      const isPlayer = winner === X_SYMBOL;
      const newWins = isPlayer ? playerWins + 1 : computerWins + 1;
      const winKey = isPlayer ? "playerWins" : "computerWins";

      isPlayer ? setPlayerWins(newWins) : setComputerWins(newWins);
      localStorage.setItem(winKey, newWins);

      const isPlayerWinner = winner === X_SYMBOL;
      setCurrentMessage(getRandomMessage(isPlayerWinner));
      setShowMessage({
        player: isPlayerWinner,
        computer: !isPlayerWinner,
      });

      setTimeout(
        () =>
          setShowMessage({
            ...showMessage,
            [isPlayer ? "player" : "computer"]: false,
          }),
        MESSAGE_DURATION
      );
    }

    if (!isNewGame && !xIsNext && !findWinningLine(squares)) {
      const randomDelay = Math.floor(Math.random() * MAX_DELAY) + MIN_DELAY;
      setTimeout(() => {
        const computerMove = getComputerMove(squares, O_SYMBOL, X_SYMBOL);
        if (computerMove !== null) {
          const newSquares = [...squares];
          newSquares[computerMove] = O_SYMBOL;
          setSquares(newSquares);
          setXIsNext(true);
        }
      }, randomDelay);
    }
    setIsNewGame(false); // Reset the new game flag
  }, [squares, xIsNext, isNewGame]);

  useEffect(() => {
    const winnerInfo = findWinningLine(squares);
    if (winnerInfo) {
      // Update win counts
      if (winnerInfo.winner === X_SYMBOL) {
        const newPlayerWins = playerWins + 1;
        setPlayerWins(newPlayerWins);
        localStorage.setItem("playerWins", newPlayerWins);
      } else if (winnerInfo.winner === O_SYMBOL) {
        const newComputerWins = computerWins + 1;
        setComputerWins(newComputerWins);
        localStorage.setItem("computerWins", newComputerWins);
      }
    }
  }, [squares]);

  // Calculate win percentage
  const totalGames = playerWins + computerWins;
  const playerWinPercentage =
    totalGames === 0 ? 50 : ((playerWins / totalGames) * 100).toFixed(2);
  const computerWinPercentage = (100 - playerWinPercentage).toFixed(2);

  // Function to handle audio errors
  const handleAudioError = (e) => {
    console.error("Audio Error: ", e);
    setAudioError("An error occurred while trying to play the audio.");
  };

  const handleClick = (i) => {
    if (findWinningLine(squares) || squares[i]) {
      return;
    }
    const newSquares = [...squares];
    newSquares[i] = X_SYMBOL;
    setSquares(newSquares);
    setXIsNext(false);
  };

  const handleNewGame = () => {
    setSquares(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setXIsNext(Math.random() < 0.5); // Randomize who starts a new game
    setIsNewGame(true); // Set the new game flag to true
  };

  const getComputerMove = (squares, mySymbol, opponentSymbol) => {
    for (const [a, b, c] of winningLines) {
      if (
        squares[a] === squares[b] &&
        squares[a] === mySymbol &&
        squares[c] === null
      ) {
        return c;
      }
      if (
        squares[a] === squares[c] &&
        squares[a] === mySymbol &&
        squares[b] === null
      ) {
        return b;
      }
      if (
        squares[b] === squares[c] &&
        squares[b] === mySymbol &&
        squares[a] === null
      ) {
        return a;
      }
    }
    for (const [a, b, c] of winningLines) {
      if (
        squares[a] === squares[b] &&
        squares[a] === opponentSymbol &&
        squares[c] === null
      ) {
        return c;
      }
      if (
        squares[a] === squares[c] &&
        squares[a] === opponentSymbol &&
        squares[b] === null
      ) {
        return b;
      }
      if (
        squares[b] === squares[c] &&
        squares[b] === opponentSymbol &&
        squares[a] === null
      ) {
        return a;
      }
    }
    const emptySquares = squares
      .map((sq, i) => (sq === null ? i : null))
      .filter((i) => i !== null);
    if (emptySquares.length) {
      const randomMove = Math.floor(Math.random() * emptySquares.length);
      return emptySquares[randomMove];
    }
    return null;
  };

  const renderSquare = (i) => {
    const winnerInfo = findWinningLine(squares);
    const isWinningSquare = winnerInfo && winnerInfo.line.includes(i);
    const isClicked = squares[i] !== null;
    const squareClassName = [
      `square`,
      isWinningSquare && "winner",
      isClicked && "clicked",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <button
        className={squareClassName}
        onClick={() => handleClick(i)}
        aria-label={`Square ${i}`}
        disabled={squares[i] !== null || !xIsNext}
      >
        {squares[i]}
      </button>
    );
  };

  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const squaresRow = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const index = row * BOARD_SIZE + col;
        squaresRow.push(
          <div
            key={index}
            className="square"
            role="gridcell"
            aria-label={`Square ${index}`}
          >
            {renderSquare(index)}
          </div>
        );
      }
      board.push(
        <div className="board-row" key={row} role="row">
          {squaresRow}
        </div>
      );
    }
    return board;
  };

  const status = computeGameStatus(squares, xIsNext, X_SYMBOL, O_SYMBOL);

  return (
    <div className="game">
      <ul className="win-count">
        <li className="player-icon">
          {X_SYMBOL}
          {showMessage.player && (
            <div
              className={`message-container ${
                showMessage.player ? "fade-in" : ""
              }`}
            >
              {currentMessage}
            </div>
          )}
        </li>
        <li className="battle-score" onClick={handleResetScore}>
          {playerWins} : {computerWins}
        </li>
        <li className="computer-icon">
          {O_SYMBOL}
          {showMessage.computer && (
            <div
              className={`message-container ${
                showMessage.computer ? "fade-in" : ""
              }`}
            >
              {currentMessage}
            </div>
          )}
        </li>
      </ul>
      <div className="progress-bar">
        <div
          className="player-progress"
          style={{ width: `${playerWinPercentage}%` }}
        ></div>
        <div
          className="computer-progress"
          style={{ width: `${computerWinPercentage}%` }}
        ></div>
      </div>
      <div className="game-board" role="grid">
        {renderBoard()}
      </div>
      <p className="status" aria-live="polite">
        {status}
      </p>
      {status === "Draw Game!" || findWinningLine(squares) ? (
        <button
          className="new-game-button"
          aria-label={`Start a new game`}
          onClick={handleNewGame}
        >
          New Game
        </button>
      ) : null}
      {findWinningLine(squares) && (
        <audio id="WinnerSound" autoPlay onError={handleAudioError}>
          <source
            src={
              findWinningLine(squares).winner === X_SYMBOL
                ? "/audio/x_wins.mp3"
                : findWinningLine(squares).winner === O_SYMBOL
                ? "/audio/o_wins.mp3"
                : ""
            }
            type="audio/mpeg"
          />
          {audioError || "Your browser does not support the audio element."}
        </audio>
      )}
    </div>
  );
}

export default App;
