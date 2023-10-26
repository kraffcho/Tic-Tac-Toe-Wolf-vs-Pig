import { findWinningLine } from "./winningLines";

export const computeGameStatus = (squares, xIsNext, X_SYMBOL, O_SYMBOL) => {
  const { winner } = findWinningLine(squares) || {};
  if (winner) {
    return `Seems like the ${winner} won this game!`;
  }
  if (squares.every((square) => square)) {
    return "Draw Game! No one won this game.";
  }
  return `Next move: ${xIsNext ? X_SYMBOL : O_SYMBOL}`;
};

export const WIN_STATE_POINTS = {
  WON: 2,
  LOOSE: -1,
  DRAW: 0,
  NOT_FINISHED: -2,
};

export const checkForWin = (squares, mySymbol) => {
  const { winner } = findWinningLine(squares) || {};

  if (winner) {
    if (winner === mySymbol) return WIN_STATE_POINTS.WON;
    else return WIN_STATE_POINTS.LOOSE;
  }

  if (squares.every((square) => square)) {
    return WIN_STATE_POINTS.DRAW;
  }
  return WIN_STATE_POINTS.NOT_FINISHED;
};
