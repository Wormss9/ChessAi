import json
import re
import numpy


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


def processMove(move):
    for sign in move:
        print(sign)
        #TO-DO: translate algebraic notation to changes in an array

data = ''
move = ''
turn = 0;
moves = []

board = numpy.zeros((8, 8))
fillBoard()

file = open('MagnusCarlsen.pgn','r')
contents = file.read()


with open("games.txt", "w") as output:
    output.close()
bracketsOpen = False
for i in contents:
    if i == '\n':
        if data != '':
            if 'Carlsen, Magnus' in data:
                print(data[1:6])
            elif '[' not in data:
                for j in data.split():
                    if j.endswith('.'):
                        turn = j[:1]
                    elif not j.endswith('.') and not re.match('^.+-.+$',j):
                        moves.append(j)
                if moves!= []:
                    print(moves)
                    moves.clear()
        data = ''
    else:
        data+=i

