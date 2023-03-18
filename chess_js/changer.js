import { clone, initialBoard, refresh, boardJson } from './utils.js'
import { pieces, pieceColor } from './pieces.js'
import { rule } from './movement.js'
import { check, checkmate } from './checker.js'
import Predictor from './predictor.js'

export default class Changer {
    constructor({ whiteAI, blackAI, tf }) {
        console.log(whiteAI, blackAI)
        this.predictor = new Predictor(tf)
        this.whiteAI = whiteAI
        this.blackAI = blackAI
        this.currentTurn = 1;
        this.oldPosition
        this.turnPhase = 0
        this.gameover = false
        this.board = initialBoard()
        refresh(this.board);
    }
    change = ({ position, mode, transformTo }) => {
        let board = this.board
        let currentTurn = this.currentTurn

        switch (this.turnPhase) {
            case 0:
                this.oldPosition = this.selectPiece({ position, board, mode });
                break;
            case 1:
                this.movePiece({ position, board, mode, transformTo, currentTurn });
                //info += this.turn;
                break
            case 2:
                this.oldPosition = this.selectPiece({ position, board, mode });
                break;
            case 3:
                this.movePiece({ position, board, mode, transformTo, currentTurn });
                //info += this.turn;
                break
        }
    }
    selectPiece = ({ position: [x, y], board, mode }) => {
        if (this.gameover) {
            this.newGame()
            return
        }

        const color = this.turnPhase == 0

        if (!board[x][y] || board[x][y].color != color) {
            document.getElementById("error").innerHTML = "Not your piece!";
            return
        }
        document.getElementById("error").innerHTML = "&#8203";
        document.querySelector('#button').value = `${pieceColor[color]} move`;
        if (this.turnPhase == 0) {
            this.turnPhase = 1;
        }
        else {
            this.turnPhase = 3;
        }
        if (!mode) {
            document.getElementById("" + x + y).setAttribute("style", 'font-weight: bold;');
        }
        return ([x, y])
    }
    movePiece = ({ position, board, mode, transformTo, currentTurn }) => {
        let boardBackup
        const [x, y] = position
        const oldPosition = this.oldPosition
        const [xs, ys] = oldPosition
        const color = this.turnPhase == 1;
        if (rule(position, oldPosition, board, mode, currentTurn)) {
            document.querySelector('#button').value = `${pieceColor[!color]} select`;
            document.getElementById(oldPosition.join('')).setAttribute("style", 'font-weight: normal;');
            let moving = {
                position,
                piece: board[x][y],
            }
            let moved = {
                oldPosition,
                piece: board[xs][ys],
            }
            board[x][y] = moved.piece;
            board[xs][ys] = null;

            //#region Transform pawn
            if (board[x][y].type == 6 && (x == 0 || x == 7)) {
                if (x == 0) {
                    switch (transformTo) {
                        case 2:
                            board[x][y] = pieces.br
                            break;
                        case 3:
                            board[x][y] = pieces.bb
                            break;
                        case 4:
                            board[x][y] = pieces.bh
                            break;
                        default:
                            board[x][y] = pieces.bq
                            break;
                    }
                }
                if (x == 7) {
                    switch (transformTo) {
                        case 2:
                            board[x][y] = pieces.wr
                            break;
                        case 3:
                            board[x][y] = pieces.wb
                            break;
                        case 4:
                            board[x][y] = pieces.wh
                            break;
                        default:
                            board[x][y] = pieces.wq
                            break;
                    }
                }
            }
            //#endregion

            if (check(board, color)) {
                this.turnPhasen -= 1;
                board[x][y] = moving.piece;
                board[xs][ys] = moved.piece;
                document.getElementById("error").innerHTML = "Check";
                document.getElementById("" + xs + ys).setAttribute("style", 'font-weight: normal;');
                return;
            }
            if (this.turnPhase == 1) {
                this.turnPhase = 2;
                if (!mode) {
                    this.saveJsonBoard();
                }
            }
            else {
                this.turnPhase = 0;
                if (!mode) {
                    currentTurn += 1;
                    this.saveJsonBoard();
                }
            }
            const checkStatus = check(board, !color);
            /* Board saving */
            if (!mode) {
                boardBackup = clone(board)
            }
            /* Checkmate */
            if (!mode && checkStatus) {
                if (checkmate(board, color, this.change)) {
                    document.getElementById("error").innerHTML = "Checkmate";
                    this.gameover = true;
                }
                else {
                    document.getElementById("error").innerHTML = "Check";
                    board = clone(boardBackup)
                    refresh(board);
                }

            }
            /* Stalemate */
            if (!mode && !checkStatus) {
                if (checkmate(board, color, this.change)) {
                    document.getElementById("error").innerHTML = "Stalemate";
                    gameover = true;
                }
                else {
                    board = clone(boardBackup)
                    refresh(board);
                }
            }
            refresh(board);

            return true;
        }
        else {
            this.turnPhase -= 1
            document.querySelector('#button').value = `${pieceColor[color]} select`;
            document.getElementById("error").innerHTML = "Cant go there";
            document.getElementById("" + xs + ys).setAttribute("style", 'font-weight: normal;');
            return true
        }
        document.getElementById("" + xs + ys).setAttribute("style", 'font-weight: normal;');
        this.saveJsonBoard()
    }
    newGame = () => {
        this.board = initialBoard()
        this.turnPhase = 0
        this.currentTurn = 1
        this.gameover = false
        refresh(this.board)
        document.getElementById("error").innerHTML = "Game over";
        document.querySelector('#button').value = "White select";
        return false;
    }
    saveJsonBoard = () => {
        this.jsonBoard = boardJson(this.board)
    }
}