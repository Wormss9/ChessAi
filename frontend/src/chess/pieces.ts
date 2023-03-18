import { Piece } from "./types";

export const pieces = {
  wr: {
    bn: "♖",
    color: "White",
    type: "rook",
  },
  wh: {
    bn: "♘",
    color: "White",
    type: "horse",
  },
  wb: {
    bn: "♗",
    color: "White",
    type: "bishop",
  },
  wk: {
    bn: "♚",
    color: "White",
    type: "king",
  },
  wq: {
    bn: "♕",
    color: "White",
    type: "queen",
  },
  wp: {
    bn: "♙",
    color: "White",
    type: "pawn",
  },
  br: {
    bn: "♜",
    color: "Black",
    type: "rook",
  },
  bh: {
    bn: "♞",
    color: "Black",
    type: "horse",
  },
  bb: {
    bn: "♝",
    color: "Black",
    type: "bishop",
  },
  bk: {
    bn: "♚",
    color: "Black",
    type: "king",
  },
  bq: {
    bn: "♛",
    color: "Black",
    type: "queen",
  },
  bp: {
    bn: "♟︎",
    color: "Black",
    type: "pawn",
  },
} as Record<string, Piece>;
