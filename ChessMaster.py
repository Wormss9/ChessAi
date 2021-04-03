from tensorflow import keras
import numpy as np
import time
chessModel = keras.models.load_model('models/theModel.h5')
x=[11.0,12.0,13.0,15.0,14.0,13.0,12.0,11.0,16.0,16.0,16.0,16.0,16.0,16.0,16.0,16.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,6.0,6.0,6.0,6.0,6.0,6.0,6.0,6.0,1.0,2.0,3.0,5.0,4.0,3.0,2.0,1.0]
#print(np.loadtxt("./training_data/test.csv",delimiter=","))
board = np.loadtxt("./training_data/test.csv",delimiter=",")
print("Predicting: ")
start = time.time() 
print(chessModel.predict(board))
elapsed = time.time()
print("Predicted in " + str(start - elapsed)+" seconds.")
y = np.array(x)
