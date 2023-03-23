import { whiteModel } from "./models/whiteModel";
import { tensor, models, LayersModel, Tensor, Rank } from "@tensorflow/tfjs";
import { Board, Position } from "./types";
import { pieceToNumber } from "./utils";

export class Predictor {
  whiteModel: Promise<LayersModel>;
  constructor() {
    this.whiteModel = models.modelFromJSON(whiteModel);
  }
  async whiteMove(board: Board): Promise<[Position, Position]> {
    const values = board
      .flat()
      .map(pieceToNumber)
      .map((x) => x + Math.random() - 0.5);
    const boardTensor = tensor(values).reshape([1, 64]);
    const resultTensor = (await this.whiteModel).predict(
      boardTensor
    ) as Tensor<Rank>;
    const result = resultTensor.arraySync()[0].map((number: number) => {
      return 8 - Math.round(number);
    });
    return [
      [result[0], result[1]],
      [result[2], result[3]],
    ];
  }
}
