# ChessAi
## Javascript

## Python
### NotationTranslator.py
_At the moment, this code is comparatively rather slow, translating around 2MB of pgn into csv-s in 64 seconds (code here https://github.com/SindreSvendby/pgnToFen only takes around 11 seconds to translate into Fen and __Run.py__, importing pgnToFen manages to translate this into lower described array notation in 30-something seconds). This is probably due to NumPy, that has be read into a Pythonic list 64 times each move. Changes in this can be expected in the near future._

This code translates the notation from .pgn format into .csv board states (file: training_data/train-boards.csv) for one color and coordinate notated moves for the other (file: training_data/train-moves.csv). Array which holds a chessboard state is read into .csv from right to left, from top to down.
Using a __color__ variable a color can be set (1 for White and 0 for Black)
Each piece is translated into a number:

White Rook: 1
White Knight: 2
White Bishop: 3
White King: 5
White Queen: 4
White Pawn: 6

Black Rook: 11
Black Knight: 12
Black Bishop: 13
Black King: 15
Black Queen: 14
Black Pawn: 16

Empty fields are 0.

.csv-s are specifically prepared for the training of the network that can be found in the file __NeuralNetwork.py__.
The other file that is generated is __tahy.txt__, which is formated for the Javascript chess engine in __chessScript.js__.



