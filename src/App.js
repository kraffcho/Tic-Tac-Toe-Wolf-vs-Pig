import React, { useState, useEffect } from "react";
import { findWinningLine, winningLines } from "./utils/winningLines";
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
    if (!xIsNext && !findWinningLine(squares)) {
      const randomDelay = Math.floor(Math.random() * 1700) + 300;
      setTimeout(() => {
        const computerMove = getComputerMove(squares, o, x);
        if (computerMove !== null) {
          const newSquares = [...squares];
          newSquares[computerMove] = o;
          setSquares(newSquares);
          setXIsNext(true);
        }
      }, randomDelay);
    }
  }, [squares, xIsNext]);

  const handleClick = (i) => {
    if (findWinningLine(squares) || squares[i]) {
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
    return findWinningLine(squares);
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
    const { winner } = findWinningLine(squares) || {};
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
