import { findWinningLine } from "./winningLines";

export const computeGameStatus = (squares, xIsNext, X_SYMBOL, O_SYMBOL) => {
  const { winner } = findWinningLine(squares) || {};
  if (winner) {
    return `Winner: ${winner}`;
  }
  if (squares.every((square) => square)) {
    return "Draw Game!";
  }
  return `Next player: ${xIsNext ? X_SYMBOL : O_SYMBOL}`;
};
