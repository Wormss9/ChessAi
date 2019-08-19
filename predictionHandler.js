<script src="https://unpkg.com/keras-js"></script>
const model = new KerasJS.Model({
    /* Tento .bin file som commitol,
    potom si ho daj dakam kde sa k nemu da pristupit cez server
    lebo pokial viem JS nevie pristupovat k lokamnym suborom,
    i ked sa iste najde cesta if you try hard enough. V kazdom
    pripade, tento kod potrebuje silno opravit lebo je to prakticky
    len copy paste a mne sa uz nechce a potom by sa mohol
    dat includenut do chessScript.js a volat proste ako funkcia co
    spapa array a returne suradnice.
    Docs: https://transcranial.github.io/keras-js-docs/usage/
    */
    filepath: 'http://localhost/ChessAi/model_bigboye.bin'
  });
function handlePrediction(data){
  model
  .ready()
  .then(() => {
    // input data object keyed by names of the input layers
    // or `input` for Sequential models
    // values are the flattened Float32Array data
    // (input tensor shapes are specified in the model config)
    const inputData = {
      input_1: new Float32Array(data)
    }

    // make predictions
    return model.predict(inputData)
  })
  .then(outputData => {
    // outputData is an object keyed by names of the output layers
    // or `output` for Sequential models
    // e.g.,
    // outputData['fc1000']
  })
  .catch(err => {
    // handle error
  })
}
// dunno, poper sa s tym Benjamine