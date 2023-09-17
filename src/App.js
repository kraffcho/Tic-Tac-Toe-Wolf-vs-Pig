import React, { useState, useEffect } from "react";
import "./App.css";

const BOARD_SIZE = 3;

function App() {
  const [squares, setSquares] = useState(
    Array(BOARD_SIZE * BOARD_SIZE).fill(null)
  );
  const [xIsNext, setXIsNext] = useState(true);
  const x = "🐺";
  const o = "🐷";

  useEffect(() => {
    if (!xIsNext) {
      // Check if the game is already won by the player or if the board is full
      if (
        calculateWinner(squares) ||
        squares.every((square) => square === x || square === o)
      ) {
        return; // Return early and do not proceed to computer's turn
      }

      const randomDelay = Math.floor(Math.random() * 1700) + 300; // Random delay between 300 and 2000 milliseconds
      setTimeout(() => {
        const computerMove = getComputerMove(squares);
        if (computerMove !== null) {
          const newSquares = [...squares];
          newSquares[computerMove] = o;
          setSquares(newSquares);
          setXIsNext(true); // Switch back to the player's turn
        }
      }, randomDelay);
    }
  }, [squares, xIsNext]);

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i] || !xIsNext) {
      return;
    }
    const newSquares = [...squares];
    newSquares[i] = x;
    setSquares(newSquares);
    setXIsNext(false);
  };

  const handleNewGame = () => {
    setSquares(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setXIsNext(true);
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const getComputerMove = (squares) => {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Check for a winning move and make it
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (squares[a] === o && squares[a] === squares[b] && !squares[c]) {
        return c;
      }
      if (squares[a] === o && squares[a] === squares[c] && !squares[b]) {
        return b;
      }
      if (squares[b] === o && squares[b] === squares[c] && !squares[a]) {
        return a;
      }
    }

    // Check for player's winning move and block it
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (squares[a] === x && squares[a] === squares[b] && !squares[c]) {
        return c;
      }
      if (squares[a] === x && squares[a] === squares[c] && !squares[b]) {
        return b;
      }
      if (squares[b] === x && squares[b] === squares[c] && !squares[a]) {
        return a;
      }
    }

    // If neither of the above, make a random move
    const emptySquares = squares
      .map((square, index) => (square === null ? index : null))
      .filter((index) => index !== null);

    if (emptySquares.length === 0) {
      return null; // No available moves
    }

    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  };

  const renderSquare = (i) => {
    const winnerInfo = calculateWinner(squares);
    const isWinningSquare = winnerInfo && winnerInfo.line.includes(i);
    const isClicked = squares[i] !== null;
    const squareClassName = `square${isWinningSquare ? " winner" : ""}${
      isClicked ? " clicked" : ""
    }`;
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

  const status = (() => {
    const { winner } = calculateWinner(squares) || {};
    if (winner) {
      return `Winner: ${winner}`;
    }
    if (squares.every((square) => square)) {
      return "Draw Game!";
    }
    return `Next player: ${xIsNext ? x : o}`;
  })();

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

  return (
    <div className="game">
      <h1 className="game-title">
        {x} vs. {o}
      </h1>
      <div className="game-board" role="grid">
        {renderBoard()}
      </div>
      <p className="status" aria-live="polite">
        {status}
      </p>
      {status === "Draw Game!" || calculateWinner(squares) ? (
        <button className="new-game-button" onClick={handleNewGame}>
          New Game
        </button>
      ) : null}
      {calculateWinner(squares) && (
        <audio id="xWinsSound" autoPlay>
          <source
            src={
              calculateWinner(squares).winner === x
                ? "/audio/x_wins.mp3"
                : calculateWinner(squares).winner === o
                ? "/audio/o_wins.mp3"
                : ""
            }
            type="audio/mpeg"
          />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default App;
