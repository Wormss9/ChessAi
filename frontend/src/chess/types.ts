export type Board = (Piece | undefined)[][];
export type Piece = {
  bn: string;
  color: Color;
  type: Type;
  turn?: number;
};
export type Position = [number, number];
export type State = {
  board: Board;
  turn: number;
  savedPosition: Position;
  turns: number;
  gameover: boolean;
};

export type Color = "White" | "Black";
export type Type = "rook" | "horse" | "bishop" | "king" | "queen" | "pawn";
