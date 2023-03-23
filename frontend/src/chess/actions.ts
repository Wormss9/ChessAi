import { pieces } from "./pieces";
import { Position, State } from "./types";
import { toast } from "vue3-toastify";
import { Color } from "./types";
import { freedom, movable, rule } from "./movement";
import { check, checkmate } from "./check";

export const selectPiece = ([x, y]: Position, state: State, test: boolean) => {
  const color: Color = state.turn == 0 ? "White" : "Black";
  if (state.board[x][y] && state.board[x][y]?.color == color) {
    state.savedPosition = [x, y];
    state.turn += 1;
  } else {
    if (!test) {
      toast.error("Not your piece");
    }
  }
};
export const movePiece = (
  position: Position,
  state: State,
  test?: boolean,
  promoteTo?: number
): boolean => {
  const color: [Color, Color] =
    state.turn == 1 ? ["White", "Black"] : ["Black", "White"];
  const [x, y] = position;
  const [xs, ys] = state.savedPosition;
  if (!movable(freedom(state.savedPosition, state), position)) {
    state.savedPosition = undefined;
    if (!test) {
      toast.error("Can't go there");
    }
    state.turn -= 1;
    return false;
  }

  if (!test) {
    rule(state.savedPosition, position, state);
  }

  const moving = {
    position: [x, y],
    piece: state.board[x][y],
  };
  const moved = {
    position: [xs, ys],
    piece: state.board[xs][ys],
  };
  state.board[x][y] = { ...state.board[xs][ys] };
  state.board[xs][ys] = undefined;

  if (state.board[x][y]?.type == "pawn" && (x == 0 || x == 7)) {
    promote(promoteTo, state, [x, y]);
  }
  if (check(state, color[0])) {
    state.board[moving.position[0]][moving.position[1]] = moving.piece;
    state.board[moved.position[0]][moved.position[1]] = moved.piece;
    toast.error("Check");
    state.turn -= 1;
    return false;
  }

  const checkStatus = check(state, color[1]);

  //Checkmate
  if (checkStatus && !test) {
    if (checkmate(state, color[1])) {
      toast.info("Checkmate");
      state.gameover = true;
    } else {
      toast.info("Check");
    }
  }

  // Stalemate
  if (!checkStatus && !test && checkmate(state, color[1])) {
    toast("Stalemate");
    state.gameover = true;
  }
  state.turn = state.turn == 1 ? 2 : 0;
  return true;
};
export const change = (
  position: Position,
  state: State,
  test?: boolean
): boolean | undefined => {
  switch (state.turn % 2) {
    case 0:
      selectPiece(position, state, test);
      break;
    case 1:
      return movePiece(position, state, test);
  }
};
const promote = (promoteTo: number, state: State, position: Position) => {
  const [x, y] = position;
  if (x == 0) {
    switch (promoteTo) {
      case 1:
        state.board[x][y] = { ...pieces.br };
        break;
      case 2:
        state.board[x][y] = { ...pieces.bb };
        break;
      case 3:
        state.board[x][y] = { ...pieces.bh };
        break;
      default:
        state.board[x][y] = { ...pieces.bq };
        break;
    }
  }
  if (x == 7) {
    switch (promoteTo) {
      case 1:
        state.board[x][y] = { ...pieces.wr };
        break;
      case 2:
        state.board[x][y] = { ...pieces.wb };
        break;
      case 3:
        state.board[x][y] = { ...pieces.wh };
        break;
      default:
        state.board[x][y] = { ...pieces.wq };
        break;
    }
  }
};
