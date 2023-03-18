import { toast } from "vue3-toastify";
import { Color, Piece, Position, State } from "./types";

const isEmpty = (x: Piece | undefined): boolean => {
  //For some reason empty proxies may appear
  return !x || !x.color;
};

function verMove(from: Position, state: State) {
  const freedom: Position[] = [];
  const [x, y] = from;
  const myColor = state.board[x][y].color;
  let i = 1;
  //Move
  while (y + i <= 7 && isEmpty(state.board[x][y + i])) {
    freedom.push([x, y + i]);
    i++;
  }
  //Take out
  if (y + i <= 7 && state.board[x][y + i].color != myColor) {
    freedom.push([x, y + i]);
  }
  //Left
  i = 1;
  while (y - i >= 0 && isEmpty(state.board[x][y - i])) {
    freedom.push([x, y - i]);
    i++;
  }
  //Take out
  if (y - i >= 0 && state.board[x][y - i].color != myColor) {
    freedom.push([x, y - i]);
  }
  //Down
  i = 1;
  while (x + i <= 7 && isEmpty(state.board[x + i][y])) {
    freedom.push([x + i, y]);
    i++;
  }
  //Take out
  if (x + i <= 7 && state.board[x + i][y].color != myColor) {
    freedom.push([x + i, y]);
  }
  //Up
  i = 1;
  while (x - i >= 0 && isEmpty(state.board[x - i][y])) {
    freedom.push([x - i, y]);
    i++;
  }
  //Take out
  if (x - i >= 0 && state.board[x - i][y].color != myColor) {
    freedom.push([x - i, y]);
  }
  return freedom;
}
function diaMove(from: Position, state: State) {
  const [x, y] = from;
  const freedom: Position[] = [];
  const myColor = state.board[x][y].color;
  //RightDown
  let i = 1;
  while (x + i <= 7 && y + i <= 7 && isEmpty(state.board[x + i][y + i])) {
    freedom.push([x + i, y + i]);
    i++;
  }
  if (x + i <= 7 && y + i <= 7 && state.board[x + i][y + i].color != myColor) {
    freedom.push([x + i, y + i]);
  }
  //LeftUp
  i = 1;
  while (x - i >= 0 && y - i >= 0 && isEmpty(state.board[x - i][y - i])) {
    freedom.push([x - i, y - i]);
    i++;
  }
  if (x - i >= 0 && y - i >= 0 && state.board[x - i][y - i].color != myColor) {
    freedom.push([x - i, y - i]);
  }
  //RightUp
  i = 1;
  while (x - i >= 0 && y + i <= 7 && isEmpty(state.board[x - i][y + i])) {
    freedom.push([x - i, y + i]);
    i++;
  }
  if (x - i >= 0 && y + i <= 7 && state.board[x - i][y + i].color != myColor) {
    freedom.push([x - i, y + i]);
  }
  //LeftDown
  i = 1;
  while (x + i <= 7 && y - i >= 0 && isEmpty(state.board[x + i][y - i])) {
    freedom.push([x + i, y - i]);
    i++;
  }
  if (x + i <= 7 && y - i >= 0 && state.board[x + i][y - i].color != myColor) {
    freedom.push([x + i, y - i]);
  }
  return freedom;
}
function pawn(from: Position, state: State) {
  const [xs, ys] = from;
  const d = state.board[xs][ys].color == "White" ? 1 : -1;
  let pas = false;
  //Direction
  const freedom: Position[] = [];
  //Move forward
  if (0 <= xs + d && xs + d <= 7 && isEmpty(state.board[xs + d][ys])) {
    freedom.push([xs + d, ys]);
    if (
      0 <= xs + 2 * d &&
      xs + 2 * d <= 7 &&
      isEmpty(state.board[xs + d][ys]) &&
      isEmpty(state.board[xs + d * 2][ys]) &&
      xs == 3.5 - 2.5 * d
    ) {
      freedom.push([xs + 2 * d, ys]);
    }
  }
  //Take out Right
  if (0 <= xs + d && xs + d <= 7 && state.board[xs + d][ys + 1]) {
    if (state.board[xs + d][ys + 1].color != state.board[xs][ys].color) {
      freedom.push([xs + d, ys + 1]);
    }
  }
  //Take out left
  if (0 <= xs + d && xs + d <= 7 && state.board[xs + d][ys - 1] != null) {
    if (state.board[xs + d][ys - 1].color != state.board[xs][ys].color) {
      freedom.push([xs + d, ys - 1]);
    }
  }
  // en passant right
  if (xs == 3.5 + 0.5 * d && state.board[xs][ys + 1] != null) {
    if (
      state.board[xs][ys + 1].color != state.board[xs][ys].color &&
      state.board[xs][ys + 1].type == "pawn" &&
      (state.board[xs][ys + 1].turn == state.turns ||
        state.board[xs][ys + 1].turn == state.turns - 1)
    ) {
      freedom.push([xs + d, ys + 1]);
      pas = true;
    }
  }
  // en passant left
  if (xs == 3.5 + 0.5 * d && state.board[xs][ys - 1] != null) {
    if (
      state.board[xs][ys - 1].color != state.board[xs][ys].color &&
      state.board[xs][ys - 1].type == "pawn" &&
      (state.board[xs][ys - 1].turn == state.turns ||
        state.board[xs][ys - 1].turn == state.turns - 1)
    ) {
      freedom.push([xs + d, ys - 1]);
      pas = true;
    }
  }
  return [freedom, from, d, pas] as [Position[], Position, number, boolean];
}
function move_pawn(
  pawn: [Position[], Position, number, boolean],
  to: Position,
  state: State
) {
  const [freedom, from, d, pas] = pawn;
  if (!movable(freedom, to)) {
    return false;
  }
  const [xs, ys] = from;
  const [x, y] = to;

  state.board[xs][ys].turn = state.turns;

  //MP takout right
  if (x == xs + d && y == ys + 1 && pas) {
    state.board[xs][ys + 1] = null;
  }
  //MP takout left
  if (x == xs + d && y == ys - 1 && pas) {
    state.board[xs][ys - 1] = null;
  }
  return true;
}
function rook(from: Position, state: State) {
  return verMove(from, state);
}
function move_rook(from: Position, to: Position, state: State) {
  const [xs, ys] = from;
  if (movable(verMove(from, state), to)) {
    state.board[xs][ys].turn = state.turns;
    return true;
  } else {
    return false;
  }
}
function horse(from: Position, state: State) {
  const freedom: Position[] = [];
  const [xs, ys] = from;
  if (xs + 2 <= 7 && ys + 1 <= 7) {
    if (
      isEmpty(state.board[xs + 2][ys + 1]) ||
      state.board[xs + 2][ys + 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs + 2, ys + 1]);
    }
  }
  if (xs + 2 <= 7 && ys - 1 >= 0) {
    if (
      isEmpty(state.board[xs + 2][ys - 1]) ||
      state.board[xs + 2][ys - 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs + 2, ys - 1]);
    }
  }
  if (xs - 2 >= 0 && ys + 1 <= 7) {
    if (
      isEmpty(state.board[xs - 2][ys + 1]) ||
      state.board[xs - 2][ys + 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs - 2, ys + 1]);
    }
  }
  if (xs - 2 >= 0 && ys - 1 >= 0) {
    if (
      isEmpty(state.board[xs - 2][ys - 1]) ||
      state.board[xs - 2][ys - 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs - 2, ys - 1]);
    }
  }
  if (xs + 1 <= 7 && ys + 2 <= 7) {
    if (
      isEmpty(state.board[xs + 1][ys + 2]) ||
      state.board[xs + 1][ys + 2].color != state.board[xs][ys].color
    ) {
      freedom.push([xs + 1, ys + 2]);
    }
  }
  if (xs + 1 <= 7 && ys - 2 >= 0) {
    if (
      isEmpty(state.board[xs + 1][ys - 2]) ||
      state.board[xs + 1][ys - 2].color != state.board[xs][ys].color
    ) {
      freedom.push([xs + 1, ys - 2]);
    }
  }
  if (xs - 1 >= 0 && ys + 2 <= 7) {
    if (
      isEmpty(state.board[xs - 1][ys + 2]) ||
      state.board[xs - 1][ys + 2].color != state.board[xs][ys].color
    ) {
      freedom.push([xs - 1, ys + 2]);
    }
  }
  if (xs - 1 >= 0 && ys - 2 >= 0) {
    if (
      isEmpty(state.board[xs - 1][ys - 2]) ||
      state.board[xs - 1][ys - 2].color != state.board[xs][ys].color
    ) {
      freedom.push([xs - 1, ys - 2]);
    }
  }
  return freedom;
}
function bishop(from: Position, state: State) {
  return diaMove(from, state);
}
function king(from: Position, state: State, test?: boolean) {
  const freedom: Position[] = [];
  const [xs, ys] = from;
  //RightDown
  if (xs + 1 < 8 && ys + 1 < 8) {
    if (
      isEmpty(state.board[xs + 1][ys + 1]) ||
      state.board[xs + 1][ys + 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs + 1, ys + 1]);
    }
  }
  //LeftUp
  if (xs - 1 >= 0 && ys - 1 < 8) {
    if (
      isEmpty(state.board[xs - 1][ys - 1]) ||
      state.board[xs - 1][ys - 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs - 1, ys - 1]);
    }
  }
  //RightUp
  if (xs - 1 >= 0 && ys + 1 < 8) {
    if (
      isEmpty(state.board[xs - 1][ys + 1]) ||
      state.board[xs - 1][ys + 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs - 1, ys + 1]);
    }
  }
  //LeftDown
  if (xs + 1 < 8 && ys - 1 >= 0) {
    if (
      isEmpty(state.board[xs + 1][ys - 1]) ||
      state.board[xs + 1][ys - 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs + 1, ys - 1]);
    }
  }
  //Right
  if (ys + 1 <= 7) {
    if (
      isEmpty(state.board[xs][ys + 1]) ||
      state.board[xs][ys + 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs, ys + 1]);
    }
  }
  //Left
  if (ys - 1 >= 0) {
    if (
      isEmpty(state.board[xs][ys - 1]) ||
      state.board[xs][ys - 1].color != state.board[xs][ys].color
    ) {
      freedom.push([xs, ys - 1]);
    }
  }
  //Down
  if (xs + 1 <= 7) {
    if (
      isEmpty(state.board[xs + 1][ys]) ||
      state.board[xs + 1][ys].color != state.board[xs][ys].color
    ) {
      freedom.push([xs + 1, ys]);
    }
  }
  //Up
  if (xs - 1 >= 0) {
    if (
      isEmpty(state.board[xs - 1][ys]) ||
      state.board[xs - 1][ys].color != state.board[xs][ys].color
    ) {
      freedom.push([xs - 1, ys]);
    }
  }
  const colork = state.board[xs][ys].color;
  //Kingside
  let ks = false;
  if (
    !test &&
    !isEmpty(state.board[xs][ys]) &&
    state.board[xs][ys].turn &&
    !endangered(from, state, colork) &&
    state.board[xs][7] &&
    state.board[xs][7].type == "rook" &&
    !isEmpty(state.board[xs][7]) &&
    state.board[xs][7].turn &&
    isEmpty(state.board[xs][5]) &&
    isEmpty(state.board[xs][6]) &&
    !endangered([xs, 5], state, colork) &&
    !endangered([xs, 6], state, colork)
  ) {
    ks = true;
    freedom.push([xs, ys + 2]);
  }
  //Queenside
  let qs = false;
  if (
    !test &&
    !isEmpty(state.board[xs][ys]) &&
    state.board[xs][ys].turn &&
    !endangered(from, state, colork) &&
    state.board[xs][0] != null &&
    state.board[xs][0].type == "rook" &&
    !isEmpty(state.board[xs][0]) &&
    state.board[xs][0].turn &&
    isEmpty(state.board[xs][2]) &&
    isEmpty(state.board[xs][1]) &&
    isEmpty(state.board[xs][3]) &&
    !endangered([xs, 2], state, colork) &&
    !endangered([xs, 3], state, colork)
  ) {
    qs = true;
    freedom.push([xs, ys - 2]);
  }
  return [freedom, qs, ks] as [Position[], boolean, boolean];
}
function move_king(
  king: [Position[], boolean, boolean],
  from: Position,
  to: Position,
  state: State
) {
  const [freedom, qs, ks] = king;
  const [x, y] = to;
  const [xs, ys] = from;
  if (!movable(freedom, to)) {
    return false;
  }
  // turn adder
  state.board[xs][ys].turn = state.turns;
  //KS takout right
  if (x == xs && y == ys + 2 && ks) {
    state.board[xs][ys + 1] = state.board[xs][ys + 3];
    state.board[xs][ys + 3] = null;
  }
  //QS takout left
  if (x == xs && y == ys - 2 && qs) {
    state.board[xs][ys - 1] = state.board[xs][ys - 4];
    state.board[xs][ys - 4] = null;
  }
  return true;
}
function queen(from: Position, state: State) {
  return diaMove(from, state).concat(verMove(from, state));
}
export function movable(freedom: Position[], to: Position) {
  return !!freedom.find(
    (position) => position[0] == to[0] && position[1] == to[1]
  );
}
export function rule(from: Position, to: Position, state: State): boolean {
  const [xs, ys] = from;
  switch (state.board[xs][ys].type) {
    case "horse":
      return true;
    case "bishop":
      return true;
    case "queen":
      return true;
    case "pawn": {
      const pawnf = pawn(from, state);
      return move_pawn(pawnf, to, state);
    }
    case "rook": {
      return move_rook(from, to, state);
    }
    case "king": {
      const kingf = king(from, state);
      return move_king(kingf, from, to, state);
    }
    default:
      toast.error("Unknown Piece rule");
      return false;
  }
}
export function freedom(
  from: Position,
  state: State,
  test?: boolean
): Position[] {
  const [xs, ys] = from;
  switch (state.board[xs][ys].type) {
    case "horse":
      return horse(from, state);
    case "bishop":
      return bishop(from, state);
    case "queen":
      return queen(from, state);
    case "pawn": {
      const pawnf = pawn(from, state);
      return pawnf[0];
    }
    case "rook": {
      return rook(from, state);
    }
    case "king": {
      const kingf = king(from, state, test);
      return kingf[0];
      return [];
    }
    default:
      toast.error("Unknown Piece Free");
      return [];
  }
}
export function endangered(position: Position, state: State, color: Color) {
  for (let k = 0; k < 8; k++) {
    for (let l = 0; l < 8; l++) {
      if (
        !isEmpty(state.board[k][l]) &&
        state.board[k][l].color != color &&
        movable(freedom([k, l], state, true), position)
      ) {
        return true;
      }
    }
  }
  return false;
}
