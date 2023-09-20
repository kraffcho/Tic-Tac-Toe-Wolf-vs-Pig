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
