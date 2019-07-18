import json


file = open('MagnusCarlsen.pgn','r')
contents = file.read()
data = ''
move = ''
moves = []
games = []
game = []
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
                    if not j.endswith('.'):
                        moves.append(j)
                print(moves)
                moves.clear()
        data = ''
    else:
        data+=i