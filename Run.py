import pgntofen
import time
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
    "8": '0,0,0,0,0,0,0,0',
    " ": ' ',
    "/": '/',
}
num = input('File number:')
start = time.time()
pgnConverter = pgntofen.PgnToFen()
pgnConverter.resetBoard()
file = "PGN/Test.pgn"
finish = pgnConverter.pgnFile(file)
f = open("FEN" + num + ".txt", "w+")
end = time.time()
timer=end - start
print("To FEN: " + str(int(timer))+"sec")
k = 0
for x in finish['succeeded'][0][1]:
    for let in x:
        if(let == ' '):
            k += 1
            if k == 3:
                k = 0
                f.write("\n")
        else:
            f.write(switcher.get(str(let), ""))
end = time.time()
print("To file: "+str(int((end - start)-timer))+"sec")
print("Total: "+str(int(end - start))+"sec")