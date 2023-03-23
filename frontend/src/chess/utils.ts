import { createBoard } from "./board";
import { Type, Piece, State, Board } from "./types";

const typeToNumber = {
  rook: 1,
  horse: 2,
  bishop: 3,
  queen: 4,
  king: 5,
  pawn: 6,
} as Record<Type, number>;

export const pieceToNumber = (piece: Piece) => {
  if (!piece || !piece.color) {
    return 0;
  }
  const cn = piece.color == "White" ? 0 : 10;
  const tn = typeToNumber[piece.type];
  return cn + tn;
};

export const saveState = (state: State): [number, Board] => {
  const turn = state.turn;
  const board = createBoard();
  for (const [i, row] of state.board.entries()) {
    for (const [j, piece] of row.entries()) {
      board[i][j] = piece;
    }
  }

  return [turn, board];
};
export const restoreState = (state: State, savedState: [number, Board]) => {
  state.turn = savedState[0];
  for (const [i, row] of savedState[1].entries()) {
    for (const [j, piece] of row.entries()) {
      state.board[i][j] = piece;
    }
  }
};
