import { pieces } from "./pieces";
import { Position, State } from "./types";
import { toast } from "vue3-toastify";
import { Color } from "./types";
import { freedom, movable, rule } from "./movement";
import { check, checkmate } from "./check";
import { createBoard } from "./board";

export const selectPiece = ([x, y]: Position, state: State) => {
  const color: Color = state.turn == 0 ? "White" : "Black";
  if (state.board[x][y] && state.board[x][y]?.color == color) {
    state.savedPosition = [x, y];
    state.turn += 1;
  } else {
    toast.error("Not your piece");
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
    state.turn = state.turn == 1 ? 0 : 2;
    state.savedPosition = undefined;
    toast.error("Cant go there");
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
    state.turn -= 1;
    state.board[moving.position[0]][moving.position[1]] = moving.piece;
    state.board[moved.position[0]][moved.position[1]] = moved.piece;
    toast.error("Check");
    return false;
  }

  const checkStatus = check(state, color[1]);

  //Board saving
  const boardBackup = createBoard();
  for (const [i, row] of state.board.entries()) {
    for (const [j, piece] of row.entries()) {
      boardBackup[i][j] = { ...piece };
    }
  }

  //Checkmate
  if (checkStatus && !test) {
    if (checkmate(state, color[1])) {
      toast.info("Checkmate");
      state.gameover = true;
    } else {
      toast.info("Check");
      let tcolor: Color;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (state.board[i][j] != boardBackup[i][j]) {
            if (state.board[i][j]) {
              tcolor = state.board[i][j].color;
            }
            // JS magic, an empty proxy is something
            state.board[i][j] = boardBackup[i][j]?.color
              ? { ...boardBackup[i][j] }
              : null;
          }
        }
      }
      state.turn = tcolor == "White" ? 0 : 2;
    }
  }

  // // Stalemate
  // if (!checkStatus && !test) {
  //   if (checkmate(state, color[1])) {
  //     toast("Stalemate");
  //     state.gameover = true;
  //   } else {
  //     let tcolor: Color;
  //     for (let i = 0; i < 8; i++) {
  //       for (let j = 0; j < 8; j++) {
  //         if (state.board[i][j] != boardBackup[i][j]) {
  //           if (state.board[i][j] != null) {
  //             tcolor = state.board[i][j].color;
  //           }
  //           state.board[i][j] = boardBackup[i][j];
  //         }
  //       }
  //     }
  //     if (tcolor == "White") {
  //       state.turn = 0;
  //     }
  //     if (tcolor == "Black") {
  //       state.turn = 2;
  //     }
  //   }
  // }
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
      selectPiece(position, state);
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
