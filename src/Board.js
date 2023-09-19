
import React from "react";

export const Board = ({ squares, handleClick, xIsNext, findWinningLine }) => {
  const BOARD_SIZE = 3;
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

  return (
    <div className="game-board" role="grid">
      {renderBoard()}
    </div>
  );
};
