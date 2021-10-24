function check(board, color) {
    var kx = -1;
    var ky;
    for (
        let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] && board[i][j].type == "king" && board[i][j].color == color) {
                kx = i;
                ky = j;
                break;
            }
        }
        if (kx != -1) {
            break;
        }
    }
    return endangered(kx, ky, board, color);
}
function endangered(kx, ky, board, color) {
    for (let k = 0; k < 8; k++) {
        for (let l = 0; l < 8; l++) {
            if (board[k][l] && board[k][l].color != color && rule([kx, ky], [k, l], board, 1, turns)) {
                return true;
            }
        }
    }
    return false;
}
function checkmate(board, color) {
    /* King */
    var kx = -1;
    var ky;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] && board[i][j].type == "king" && board[i][j].color == color) {
                kx = i;
                ky = j;
                break;
            }
        }
        if (kx != -1) {
            break;
        }
    }
    /* Freedoms */
    let pieces = [];
    let freedoms = [];
    color = !color
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] && board[i][j].color != color) {
                if (rule([0, 0], [i, j], board, 2, turns).length != 0) {
                    pieces.push([i, j]);
                    freedoms.push(rule([0, 0], [i, j], board, 2, turns));
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

export { check, endangered, checkmate }