from fastapi import FastAPI
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from itertools import permutations
from car import CAR
import threading
import time
import sys
import uvicorn
import queue
import cv2
import math
import numpy as np
import RPi.GPIO as GPIO
import datetime
import json


class LOCATION(BaseModel):
    counter: list
    kitchen: list
    table: dict


class ENV(BaseModel):
    maps: list
    location: LOCATION


class Task(BaseModel):
    start: int
    stop: list
    end: int


cap = cv2.VideoCapture(0)
dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_6X6_250)
parameters = cv2.aruco.DetectorParameters()
detector = cv2.aruco.ArucoDetector(dictionary, parameters)
fs = cv2.FileStorage("output.xml", cv2.FILE_STORAGE_READ)
intrinsic = fs.getNode("intrinsic").mat()
distortion = fs.getNode("distortion").mat()
car = CAR()


env = None
tasks_que = queue.Queue()
app = FastAPI()

current_pos, next_pos = None, None

# button_pin = 5
# GPIO.setmode(GPIO.BCM)
# GPIO.setup(button_pin, GPIO.IN)


@app.get("/get_info")
async def get_info():
    global current_pos, next_pos
    return json.dumps({"current_position": current_pos, "next_pos": next_pos})


@app.post("/sendmap")
async def bulid_env(Env: ENV):
    global env
    env = Env
    print(env.maps)
    print(env.location.counter)
    print(env.location.kitchen)
    print(env.location.table)
    return "OK"


@app.post("/sendtask")
async def get_task(task: Task):
    if not env:
        return "Environment unset, please send the map first"

    tasks_que.put(task)
    now = datetime.datetime.now(
        tz=datetime.timezone(datetime.timedelta(hours=8)))
    time = '[%s GMT+0800 (台北標準時間)]' % now.strftime('%a %b %d %Y %H:%M:%S')
    cmd = {"start": task.start, "stop": task.stop, "end": task.end}
    with open("log.txt", "a") as logfile:
        logfile.write(
            time + json.dumps({"logs": "receive", "cmd": cmd}) + "\n")

    return "OK"


def do_task():
    while 1:
        if not tasks_que.empty():
            try:
                # print(tasks_que.qsize())
                task = tasks_que.get()
                # path = bfs(env.maps, (0, 0), (3, 3))
                start, end = (0, 0), (3, 3)
                stops = [tuple(env.location.table[str(_)]) for _ in task.stop]
                shortest_path = find_path(env.maps, start, stops, end)
                # print(stops)
                # print(task.stop)
                print(shortest_path)
                for i in range(len(shortest_path) - 1):
                    global current_pos, next_pos
                    current_pos = shortest_path[i]
                    next_pos = shortest_path[i + 1]
                    print(current_pos)
                    # if current_pos in stops:
                    #     while True:
                    #         state = GPIO.input(button_pin)
                    #         if state:
                    #             print("on")
                    #             break
                    #         else:
                    #             print("off")
                    #         time.sleep(1)
                    move_to_next(current_pos, next_pos)
                current_pos = next_pos
                next_pos=None
                cal()  # 走完校正
                now = datetime.datetime.now(
                    tz=datetime.timezone(datetime.timedelta(hours=8)))
                time = '[%s GMT+0800 (台北標準時間)]' % now.strftime('%a %b %d %Y %H:%M:%S')
                cmd = {"start": task.start, "stop": task.stop, "end": task.end}
                with open("log.txt", "a") as logfile:
                    logfile.write(
                        time + json.dumps({"logs": "success", "cmd": cmd}) + "\n")

            except Exception as e:
                print('error:', e)
                pass
            finally:
                pass
                # sr04.sr04_stop()
                # GPIO.cleanup()


def cal():
    key = 0
    while key != ord('q'):
        ret, frame = cap.read()
        markerCorners, markerIds, rejectedCandidates = detector.detectMarkers(
            frame)

        ids, idx = None, None
        # print(type(markerIds))
        # if markerIds != None:
        if np.logical_not(markerIds is None):
            ids = markerIds.ravel()
            idx = np.argmin(ids)

        # markerCorners, markerIds, rejectedCandidates = cv2.aruco.detectMarkers(
        #     frame, dictionary, parameters=parameters)
        frame = cv2.aruco.drawDetectedMarkers(frame, markerCorners, markerIds)
        rvec, tvec, _objPoints = cv2.aruco.estimatePoseSingleMarkers(
            markerCorners, 18.5, intrinsic, distortion)

        try:
            R, _ = cv2.Rodrigues(rvec[idx][0])
            O = np.matmul(R, np.array([[0], [0], [1]]))
            yaw = np.rad2deg(math.atan2(O[2], O[0])) + 90
            x, y, z = [round(_, 3) for _ in tvec[idx][0]]
            text = "x:" + str(x)+" y:" + str(y)+" z:" + \
                str(z) + "yaw:" + str(yaw)
            frame = cv2.putText(
                frame, text, (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 255), 1, cv2.LINE_AA)
            print(x, y, z, yaw)
            if yaw > 10:
                car.turn_left(num_steps=10)
            elif yaw < -10:
                car.turn_right(num_steps=10)
            elif x < 2:
                car.go_left(num_steps=50)
            elif x > 8:
                car.go_right(num_steps=50)
            elif z > 90:
                car.forward(num_steps=100)
            elif z < 80:
                car.backward(num_steps=30)
            else:
                cv2.destroyAllWindows()
                break
        except:
            pass

        cv2.imshow("frame", frame)
        key = cv2.waitKey(33)


def move_to_next(current_pos, next_pos):
    x_diff = next_pos[0] - current_pos[0]
    y_diff = next_pos[1] - current_pos[1]
    if x_diff > 0:
        car.forward()
    elif x_diff < 0:
        car.backward()
    elif y_diff > 0:
        car.go_right()
    else:
        car.go_left()


def bfs(matrix, start, end):
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    rows, cols = len(matrix), len(matrix[0])
    visited = [[False] * cols for _ in range(rows)]
    visited[start[0]][start[1]] = True
    prev = {}
    que = queue.Queue()
    que.put((start, 0))
    prev[start] = None
    while not que.empty():
        pos, dist = que.get()
        if pos == end:
            path = []
            while pos is not None:
                path.append(pos)
                pos = prev[pos]
            return path[::-1], dist

        for dir in directions:
            to_x, to_y = pos[0] + dir[0], pos[1] + dir[1]
            if to_x < 0 or to_x == rows or to_y < 0 or to_y == cols or matrix[to_x][to_y] == 0 or visited[to_x][to_y]:
                continue
            visited[to_x][to_y] = True
            prev[(to_x, to_y)] = pos
            que.put(((to_x, to_y), dist+1))

    return None, None


def find_path(map_array, start, stops, end):
    min_len = sys.maxsize
    final_path = None
    for stop in permutations(stops):
        st, len_cnt = start, 0
        path = [st]
        for s in stop:
            p, cnt = bfs(map_array, st, s)
            if not p:
                return None
            st = s
            len_cnt += cnt
            path += p[1:]

        p, cnt = bfs(map_array, st, end)
        len_cnt += cnt
        path += p[1:]

        if len_cnt < min_len:
            min_len = len_cnt
            final_path = path
    return final_path


if __name__ == "__main__":
    thread = threading.Thread(target=lambda: do_task()).start()
    print("server start")
    uvicorn.run(app, host="0.0.0.0", port=8000)
    # fastapi_thread = threading.Thread(target=lambda: run_fastapi)
    # fastapi_thread.start()
