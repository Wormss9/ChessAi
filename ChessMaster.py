from tensorflow import keras
import numpy as np
import time
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware

os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

class Board(BaseModel):
    state: List[float]

whiteModel:keras.Model = keras.models.load_model('models/white13.h5')
blackModel:keras.Model = keras.models.load_model('models/theModel.h5')
app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"])

board:np.ndarray = np.array([11.0,12.0,13.0,15.0,14.0,13.0,12.0,11.0,16.0,16.0,16.0,16.0,16.0,16.0,16.0,16.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,6.0,6.0,6.0,6.0,6.0,6.0,6.0,6.0,1.0,2.0,3.0,5.0,4.0,3.0,2.0,1.0]).reshape(-1,64)
print(whiteModel.predict(board)[0])


@app.post("/whiteprediction/")
async def predict(board: Board):
    board:np.ndarray = np.array(board.state).reshape(-1,64)
    #return board.shape
    return {"AITurn":[round(elem, 0) for elem in whiteModel.predict(board)[0].tolist()]}

@app.post("/blackprediction/")
async def predict(board: Board):
    board:np.ndarray = np.array(board.state).reshape(-1,64)
    #return board.shape
    return {"AITurn":[round(elem, 0) for elem in whiteModel.predict(board)[0].tolist()]}

if __name__ == "__main__":
    uvicorn.run("ChessMaster:app", host="127.0.0.1", port=8888, log_level="info", reload=True)


#x=[11.0,12.0,13.0,15.0,14.0,13.0,12.0,11.0,16.0,16.0,16.0,16.0,16.0,16.0,16.0,16.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,6.0,6.0,6.0,6.0,6.0,6.0,6.0,6.0,1.0,2.0,3.0,5.0,4.0,3.0,2.0,1.0]
#print(np.loadtxt("./training_data/test.csv",delimiter=","))
#board:np.ndarray = np.array(x).reshape(-1,64)
#print(whiteModel.input_shape)
#print(board.shape)
#exit()
#print("Predicting: ")
#start = time.time() 
#print(whiteModel.predict(board))
#elapsed = time.time()
#print("Predicted in " + str(elapsed - start)+" seconds.")
