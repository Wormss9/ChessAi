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

os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
filenumber=1
print('Reading Input:')
readStart=time.time()
boards = np.loadtxt("./data/wb"+str(filenumber)+".csv",delimiter=",")
input_shape = boards.shape[1]
print("Done in %.0f" % ((time.time()-readStart)/60) +
      " minutes and %.2f" % ((time.time()-readStart) % 60)+" seconds")
print('Reading Output:')
readStart=time.time()
moves = np.loadtxt("./data/wm"+str(filenumber)+".csv",delimiter=",")
output_shape = moves.shape[1]
print("Done in %.0f" % ((time.time()-readStart)/60) +
      " minutes and %.2f" % ((time.time()-readStart) % 60)+" seconds")
print('All read..')
# Stop after validation loss hasn't dropped for 5 epochs
early_stopping = EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True)

model = Sequential()
# Input layer
model.add(Dense(64, input_shape=(input_shape,), activation='relu'))
# Intermediate layers
model.add(Dense(64, activation='relu'))
model.add(Dense(64, kernel_initializer='uniform', activation='relu'))
model.add(Dense(64, kernel_initializer='uniform', activation='relu'))
model.add(Dense(64, kernel_initializer='uniform', activation='relu'))
model.add(Dense(64, kernel_initializer='uniform', activation='relu'))
model.add(Dense(64, kernel_initializer='uniform', activation='relu'))
model.add(Dense(32, kernel_initializer='uniform', activation='relu'))
model.add(Dense(16, kernel_initializer='uniform', activation='relu'))
# Output layer
model.add(Dense(output_shape, kernel_initializer='uniform', activation='relu'))
# Compiling model
model.compile(Adam(lr = 0.001), loss='mse', metrics=['acc'])
# Fitting model
history = model.fit(boards,moves, batch_size=int(input_shape), callbacks=[early_stopping], validation_split=0.2, epochs=5, verbose = 2)
model.save('models/white1.h5')