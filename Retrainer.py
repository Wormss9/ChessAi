from keras.models import *
from keras.layers import *
from keras.callbacks import EarlyStopping
from keras.optimizers import *
import matplotlib.pyplot as plt
import csv
import h5py
import numpy as np
import os
import time


filenumber = 2
filepath = "models/white" + str(filenumber-1) + ".h5"
# load the model
model = load_model(filepath)
# load data
print('Reading Input:')
readStart1 = time.time()
boards = np.loadtxt("./data/wb"+str(filenumber)+".csv", delimiter=",")
input_shape = boards.shape[1]
print("Done in %.0f" % ((time.time()-readStart1)/60) +
      " minutes and %.2f" % ((time.time()-readStart1) % 60)+" seconds")
print('Reading Output:')
readStart2 = time.time()
moves = np.loadtxt("./data/wm"+str(filenumber)+".csv", delimiter=",")
output_shape = moves.shape[1]
print("Done in %.0f" % ((time.time()-readStart2)/60) +
      " minutes and %.2f" % ((time.time()-readStart2) % 60)+" seconds")
print("All read in %.0f" % ((time.time()-readStart1)/60) +
      " minutes and %.2f" % ((time.time()-readStart1) % 60)+" seconds")
# fit the model
early_stopping = EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True)
history = model.fit(boards, moves, batch_size=int(input_shape), callbacks=[
                    early_stopping], validation_split=0.2, epochs=5, verbose=2)
model.save('models/white'+str(filenumber)+'.h5')
