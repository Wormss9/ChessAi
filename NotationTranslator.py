import json
import re
import numpy

# necessary functions
def fillBoard():
    board[0,0] = board[0,7] = 1     #wr
    board[0, 1] = board[0, 6] = 2   #wh
    board[0,2] = board[0, 5] = 3    #wb
    board[0,3] = 4                  #wk
    board[0,4] = 5                  #wq
    x = 0
    while x < 8:
        board[1,x] = 6              #wp
        board[6,x] = 16             #bp
        x+=1

    board[7, 0] = board[7, 7] = 11  #br
    board[7, 1] = board[7, 6] = 12  #wh
    board[7, 2] = board[7, 5] = 13  #wb
    board[7, 3] = 15                #bq
    board[7, 4] = 14                #bk
squareNumber = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "e": 4,
    "f": 5,
    "g": 6,
    "h": 7
}
#char(96+x)?
#ord(char) - 96?
# wtf?
#ftw!

def queenMove(is_capture,from_coord_x,from_coord_y,to_coord_x,to_coord_y,is_check):
    # every move is checked as if it was an entirely ambiguous capture move, then treated accordingly if it isn't ambiguous
    # or a capture move, this function will handle that logic,

def kingMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check):
    # every move is checked as if it was an entirely ambiguous capture move, then treated accordingly if it isn't ambiguous
    # or a capture move, this function will handle that logic,

def bishopMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check):
    # every move is checked as if it was an entirely ambiguous capture move, then treated accordingly if it isn't ambiguous
    # or a capture move, this function will handle that logic,

def knightMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check):
    # every move is checked as if it was an entirely ambiguous capture move, then treated accordingly if it isn't ambiguous
    # or a capture move, this function will handle that logic,

def rookMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check):
    # every move is checked as if it was an entirely ambiguous capture move, then treated accordingly if it isn't ambiguous
    # or a capture move, this function will handle that logic,

def pawnMove(is_capture, from_coord_x, from_coord_y, to_coord_x, to_coord_y, is_check):
    # every move is checked as if it was an entirely ambiguous capture move, then treated accordingly if it isn't ambiguous
    # or a capture move, this function will handle that logic,

def processMove(move,turn):
    isCheck = False
    if move[:1].isLower():
        if move[-1:] == '+':
            isCheck = True
            move = move[:-1]
            # pawnMove()
    else:
            if move[:1] == 'Q':
                if move[-1:] == '+':
                    isCheck = True
                    move = move[:-1]
            if move[:1] == 'K':
                if move[-1:] == '+':
                    isCheck = True
                    move = move[:-1]
            if move[:1] == 'N':
                if move[-1:] == '+':
                    isCheck = True
                    move = move[:-1]
            if move[:1] == 'B':
                if move[-1:] == '+':
                    isCheck = True
                    move = move[:-1]
            if move[:1] == 'R':
                if move[-1:] == '+':
                    isCheck = True
                    move = move[:-1]
            # make rules for movement of everything else, queen, king, rook, horse and bishop
        #TO-DO: translate algebraic notation to changes in an array

# declaring variables
data = ''
move = ''
turn = 0;
moves = []

# data structures
board = numpy.zeros((8, 8))
fillBoard()

file = open('MagnusCarlsen.pgn','r')
contents = file.read()

# emptying the .csv file
with open("train-games.csv", "w") as output:
    output.close()

bracketsOpen = False
for i in contents:
    if i == '\n':
        if data != '':
            if 'Carlsen, Magnus' in data:
                print(data[1:6])
            elif '[' not in data:
                for j in data.split():
                    if not j.endswith('.') and not re.match('^.+-.+$',j):
                        moves.append(j)
                if moves!= []:
                    for move in moves:
                        turn+=1
                        processMove(move,turn)

        data = ''
    else:
        data+=i

