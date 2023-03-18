import { Color, Position, State } from "./types";
import { endangered, freedom } from "./movement";

const find_king = (state: State, color: Color): Position => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (
        state.board[i][j] &&
        state.board[i][j].type == "king" &&
        state.board[i][j].color == color
      ) {
        return [i, j] as Position;
      }
    }
  }
  throw Error("No king");
};

export function check(state: State, color: Color) {
  return endangered(find_king(state, color), state, color);
}

export function checkmate(state: State, myColor: Color) {
  //freedoms
  const pieces: Position[] = [];
  const freedoms: Position[][] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (state.board[i][j] && state.board[i][j].color == myColor) {
        pieces.push([i, j]);
        freedoms.push(freedom([i, j], state));
      }
    }
  }
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
        state.board[moving.position[0]][moving.position[1]] = {
          ...moving.piece,
        };
        state.board[moved.position[0]][moved.position[1]] = { ...moved.piece };
      } else {
        console.log(moving, moved);
        return false;
      }
    }
  }
  return true;
}
