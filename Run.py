import pgntofen
import time
import glob
import os
import re
import numpy as np
import math

#translate() filters and cuts games for transformall(). transformall() gives transform2() the fenboard. transform2 generates moves and gives them with the boards to save().

switcher = {
    "r": '11,',
    "n": '12,',
    "b": '13,',
    "q": '14,',
    "k": '15,',
    "p": '16,',
    "R": '1,',
    "N": '2,',
    "B": '3,',
    "Q": '4,',
    "K": '5,',
    "P": '6,',
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

def transformtoarray(board1):
    listb = transformfen(board1).split(",")
    listb.pop()
    return np.array(listb, dtype=float)

def transform2(board1,board2):
    fromt=[]
    tot=[]
    for tile in range(64):
        if (board1-board2)[tile]>0 and board2[tile]==0:
            fromt.append([round(tile/8+0.5),tile%8+1])
        if (board1-board2)[tile]!=0 and (board1[tile]==0 or board1[tile]>10):
            tot.append([round(tile/8+0.5),tile%8+1])
    if len(tot)==2 and tot[0][0]==tot[1][0]==tot[0][0]==tot[1][0]==8:
        #print("rosada")
        if  tot[0][1]>5:
            tot=[[8,5]]
            fromt=[[8,7]]
        else:
            tot=[[8,5]]
            fromt=[[8,3]]
    elif len(tot)==2:
        with open('data/error.txt', 'a') as file:
            file.write("Unknown: \n"+str(board1)+"\n"+str(board2))
        return 0
    save(board1,[fromt[0][0],fromt[0][1],tot[0][0],tot[0][1]])

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
            transform2(transformtoarray(board1),transformtoarray(pgnConverter.getFullFen()))
        x=x+1
        #print("Move: "+move)
        pgnConverter.move(move)

def translate(path: str,white_won: bool):
    global y
    if white_won:
        victory="1-0"
    else:
        victory="0-1"
    opened = time.time()
    for filename in glob.glob(os.path.join(path, '*.pgn')):
     with open(os.path.join(os.getcwd(), filename), 'r') as file:
        y+=1
        gameno=1
        global errors
        duration=time.time()-opened
        print("File "+str(y)+"/1303 "+filename+". Last file in "+ str(math.floor(duration/60))+" minutes "+ str(duration%60) +" seconds.")
        opened = time.time()
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
                gameno+=1
                #print("Game: "+moves)
                try:
                    transformall(moves)
                except:
                    errors.append("Error: "+filename+" game: "+str(gameno))
            line = file.readline()

def save(board,move):
    global x
    x+=1
    filenumber=str(int(round(x/3500000+0.5,0)))
    with open('data/board'+filenumber+'.csv', 'a') as file:
        file.write((str(board)[1:-1].replace("\n","").replace(".",".0,").replace(" ","")+"\n").replace(",\n","\n"))
    with open('data/moves'+filenumber+'.csv', 'a') as file:
        file.write((str(move)[1:-1]+"\n").replace(" ",""))

start = time.time()
errors=[]
x=0
y=0
translate("PGN/",True)
print("Translated in %.0f" % ((time.time()-start)/60)+" minutes and %.2f" % ((time.time()-start)%60)+" seconds")
with open('errors.csv', 'a') as file:
        file.write(str(errors))