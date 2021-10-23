const pieces = {
    wr: {
        bn: "&#9814;",
        color: true,
        type: 1,
        turn: null
    },
    wh: {
        bn: "&#9816;",
        color: true,
        type: 2
    },
    wb: {
        bn: "&#9815;",
        color: true,
        type: 3
    },
    wk: {
        bn: "&#9812;",
        color: true,
        type: 5,
        turn: null
    },
    wq: {
        bn: "&#9813;",
        color: true,
        type: 4
    },
    wp: {
        bn: "&#9817;",
        color: true,
        type: 6,
        turns: null
    },
    br: {
        bn: "&#9820;",
        color: false,
        type: 1,
        turn: null
    },
    bh: {
        bn: "&#9822;",
        color: false,
        type: 2
    },
    bb: {
        bn: "&#9821;",
        color: false,
        type: 3
    },
    bk: {
        bn: "&#9818;",
        color: false,
        type: 5,
        turn: null
    },
    bq: {
        bn: "&#9819;",
        color: false,
        type: 4
    },
    bp: {
        bn: "&#9823;",
        color: false,
        type: 6,
        turn: null
    }
}
const pieceType= {
 1:"rook",
 2:"horse",
 3:"bishop",
 4:"queen",
 5:"king",
 6:"pawn",
}
const pieceColor={
    true:"White",
    false:"Black"
}
export { pieces, pieceType, pieceColor }