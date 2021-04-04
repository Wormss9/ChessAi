import pgntofen
import time
import glob
import os
import io
import re

switcher = {
    "r": '1,',
    "n": '2,',
    "b": '3,',
    "q": '4,',
    "k": '5,',
    "p": '6,',
    "R": '11,',
    "N": '12,',
    "B": '13,',
    "Q": '14,',
    "K": '15,',
    "P": '16,',
    "1": '0,',
    "2": '0,0,',
    "3": '0,0,0,',
    "4": '0,0,0,0,',
    "5": '0,0,0,0,0,',
    "6": '0,0,0,0,0,0,',
    "7": '0,0,0,0,0,0,0,',
    "8": '0,0,0,0,0,0,0,0,',
    " ": '"',
    "/": '',
}

def transformfen(board):
    finboard=""
    for lines in board.splitlines():
        line=""
        for letter in (lines.split(" ")[0]):
            line+= switcher.get(letter)
        finboard+=line
    return finboard

def transform2(board1,board2):
    print(transformfen(board1))

def transformall(moves):
    pgnConverter = pgntofen.PgnToFen()
    pgnConverter.resetBoard()
    clean_moves=(re.sub("[0-9]*\.", "",moves)).split()
    clean_moves.pop()
    x=0
    for move in clean_moves:
        if x%2==0:
            board1=pgnConverter.getFullFen()
        else:
            transform2(board1,pgnConverter.getFullFen())
        x=x+1
        pgnConverter.move(move)

def translate(path: str,white_won: bool):
    if white_won:
        victory="1-0"
    else:
        victory="0-1"
    for filename in glob.glob(os.path.join(path, '*.pgn')):
     with open(os.path.join(os.getcwd(), filename), 'r') as file:
        print(filename)
        line = file.readline()
        while line:
            line = line.replace('\n', '')
            if '[' in line and victory in line and ']' in line and victory in line:
                moves=""
                while line not in ('\n', '\r\n'):
                    line = file.readline()
                line = file.readline()
                while line not in ('\n', '\r\n'):
                    moves+=line
                    line = file.readline()
                transformall(moves)
            line = file.readline()
start = time.time()
translate("PGN/",True)
print("Translated in %.0f" % ((time.time()-start)/60)+" minutes and %.2f" % ((time.time()-start)%60)+" seconds")