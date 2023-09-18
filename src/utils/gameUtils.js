import { findWinningLine } from "./winningLines";

export const computeGameStatus = (squares, xIsNext, X_SYMBOL, O_SYMBOL) => {
  const { winner } = findWinningLine(squares) || {};
  if (winner) {
    return `The winner: ${winner}`;
  }
  if (squares.every((square) => square)) {
    return "Draw Game!";
  }
  return `Next move: ${xIsNext ? X_SYMBOL : O_SYMBOL}`;
};
