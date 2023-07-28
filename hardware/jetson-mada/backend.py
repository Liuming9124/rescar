from fastapi import FastAPI
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from typing import List
import threading
import json
import time
import uvicorn
import queue
from car import CAR


class Task(BaseModel):
    maps: list
    location: dict


tasks_que = queue()
counter = 0
car = CAR()
app = FastAPI()


def increment_counter():
    global counter
    while True:
        counter += 1


@app.get("/counter")
def get_todos():
    return (f'這是機器人{counter}')  # 傳送


@app.post("/items")
async def create_item(item: Task):
    tasks_que.put(item)
    return "OK"


def run_fastapi():
    print("server start")
    uvicorn.run(app, host="0.0.0.0", port=8000)


def func():
    while not tasks_que.empty():
        task = tasks_que.get()
    

if __name__ == "__main__":

    counter_thread = threading.Thread(target=lambda: increment_counter)
    counter_thread.start()
    thread = threading.Thread(target=lambda: func)
    thread.start()
    run_fastapi()
    # fastapi_thread = threading.Thread(target=lambda: run_fastapi)
    # fastapi_thread.start()
