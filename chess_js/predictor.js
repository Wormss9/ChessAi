import whiteModel from './JSONModels/whiteModel.js'

console.log(whiteModel)
export default class Predictor {
    constructor(tf) {
        this.whiteModel = tf.models.modelFromJSON(whiteModel);

    }
    whiteMove(jsonBoard) {
        return this.whiteModel.predict(jsonBoard)
    }
    blackMove(jsonBoard) {
        return this.blackModel.predict(jsonBoard)
    }
}
