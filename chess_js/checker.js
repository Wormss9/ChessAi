import { rule } from './movement.js'

function check(board, color) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] && board[i][j].type == 5 && board[i][j].color == color) {
                return endangered([i, j], board, color)
            }
        }
    }
    throw "King not found"
}
function endangered([x, y], board, color) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] && board[i][j].color != color && rule([x, y], [i, j], board, 1)) {
                return true;
            }
        }
    }
    return false;
}
function checkmate(board, color, change) {
    if (check(board, color)) {
        /* Freedoms */
        let pieces = [];
        let freedoms = [];
        const mode = "check"
        color = !color
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] && board[i][j].color != color) {
                    if (rule([0, 0], [i, j], board, mode).length != 0) {
                        pieces.push([i, j]);
                        freedoms.push(rule([0, 0], [i, j], board, mode));
                    }
                }
            }
        }
        return (pieces, freedoms) => {
            for (let i = 0; i < pieces.length; i++) {
                for (let j = 0; j < freedoms[i].length; j++) {
                    change(pieces[i], 1);
                    console.log(pieces[i])
                    if (change(freedoms[i][j], 1)) {
                        return false;
                    }
                }
            }
            return true
        }
    }
    return false
}
export { check, endangered, checkmate }