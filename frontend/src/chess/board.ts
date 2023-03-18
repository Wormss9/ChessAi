import { pieces } from "./pieces";
import { Board, Piece } from "./types";

export function createBoard(): Board {
  const board = new Array<Array<Piece | undefined>>(8);
  for (let i = 0; i < 8; i++) {
    board[i] = new Array<Piece | undefined>(8);
  }
  return board;
}

export const initializeBoard = (board: Board) => {
  board[0][0] = { ...pieces.wr };
  board[0][7] = { ...pieces.wr };
  board[7][0] = { ...pieces.br };
  board[7][7] = { ...pieces.br };
  board[0][1] = { ...pieces.wh };
  board[0][6] = { ...pieces.wh };
  board[7][1] = { ...pieces.bh };
  board[7][6] = { ...pieces.bh };
  board[0][2] = { ...pieces.wb };
  board[0][5] = { ...pieces.wb };
  board[7][2] = { ...pieces.bb };
  board[7][5] = { ...pieces.bb };
  board[0][4] = { ...pieces.wk };
  board[0][3] = { ...pieces.wq };
  board[7][4] = { ...pieces.bk };
  board[7][3] = { ...pieces.bq };
  for (let i = 0; i < 8; i++) {
    board[1][i] = { ...pieces.wp };
    board[6][i] = { ...pieces.bp };
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      board[i + 2][j] = null;
    }
  }
  return board;
};
