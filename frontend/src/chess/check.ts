import { Color, Position, State } from "./types";
import { endangered, freedom } from "./movement";
import { restoreState, saveState } from "./utils";

const find_king = (state: State, color: Color): Position => {
  for (const [i, row] of state.board.entries()) {
    for (const [j, piece] of row.entries()) {
      if (piece && piece.type == "king" && piece.color == color) {
        return [i, j] as Position;
      }
    }
  }
  throw Error("No king");
};

export function check(state: State, color: Color) {
  return endangered(find_king(state, color), state, color);
}

export function checkmate(state: State, myColor: Color): boolean {
  const savedState = saveState(state);
  const pieces: Position[] = [];
  const freedoms: Position[][] = [];
  for (const [i, row] of state.board.entries()) {
    for (const [j, piece] of row.entries()) {
      if (piece && piece.color == myColor) {
        pieces.push([i, j]);
        freedoms.push(freedom([i, j], state));
      }
    }
  }
  console.log(pieces);
  for (const [i, piece] of pieces.entries()) {
    for (const freedom of freedoms[i]) {
      const [xs, ys] = piece;
      const [x, y] = freedom;
      const moved = {
        position: [xs, ys],
        piece: state.board[xs][ys] ? state.board[xs][ys] : undefined,
      };
      const moving = {
        position: [x, y],
        piece: state.board[x][y] ? state.board[x][y] : undefined,
      };
      state.board[x][y] = { ...moved.piece };
      state.board[xs][ys] = undefined;

      if (check(state, myColor)) {
        //Prepare for next try
        state.board[moving.position[0]][moving.position[1]] = {
          ...moving.piece,
        };
        state.board[moved.position[0]][moved.position[1]] = { ...moved.piece };
      } else {
        //Prepare for next turn
        restoreState(state, savedState);
        return false;
      }
    }
  }
  return true;
}
