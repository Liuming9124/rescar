from fastapi import FastAPI
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from itertools import permutations
from car import CAR
import threading
import signal
import sys
import uvicorn
import queue
import cv2
import math
import numpy as np
import RPi.GPIO as GPIO
import datetime
import json
import time
import INA219


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
    # end: int


cap = cv2.VideoCapture(0)
dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_6X6_250)
parameters = cv2.aruco.DetectorParameters()
detector = cv2.aruco.ArucoDetector(dictionary, parameters)
fs = cv2.FileStorage("output.xml", cv2.FILE_STORAGE_READ)
intrinsic = fs.getNode("intrinsic").mat()
distortion = fs.getNode("distortion").mat()
car = CAR()
use_sr04 = True
if use_sr04:
    import hc_sro04 as sr04

env = None
tasks_que = queue.Queue()
app = FastAPI()

current_pos, next_pos = None, None
next_stop = None
on_task = False
coor_map = dict()

button1_pin, button2_pin = 5, 12
GPIO.setmode(GPIO.BCM)
GPIO.setup(button1_pin, GPIO.IN)
GPIO.setup(button2_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)


def button2_pressed_callback(channel):
    sr04.sr04_stop()
    print("Button2 pressed!")
    GPIO.cleanup()
    sys.exit()


GPIO.add_event_detect(button2_pin, GPIO.FALLING,
                      callback=button2_pressed_callback, bouncetime=100)


def signal_handler(signalNumber, frame):
    print('Received SIGINT:')
    sr04.sr04_stop()
    GPIO.cleanup()
    sys.exit()


def wait_button():
    while True:
        state = GPIO.input(button1_pin)
        if state:
            # print("on")
            break
        # else:
            # print("off")
        time.sleep(0.2)


@app.on_event("startup")
async def startup_event():
    signal.signal(signal.SIGINT, signal_handler)


@app.get("/get_info")
async def get_info():
    global current_pos, next_pos, on_task, next_stop
    status = "Moving" if on_task else "Ready"
    if use_sr04:
        sr04_active = 1 if sr04.distance < 30 else 0
    else:
        sr04_active = 0
    return json.dumps({"status": status, "current_position": current_pos, "next_pos": next_pos, "battery": INA219.get_battery_info(),
                       "sr04_active": sr04_active, "next_stop": next_stop})


@app.post("/sendmap")
async def bulid_env(Env: ENV):
    global env, coor_map
    env = Env
    coor_map[0] = tuple(env.location.kitchen)
    print(env.maps)
    print(env.location.counter)
    print(env.location.kitchen)
    print(env.location.table)
    return "OK"


@app.post("/sendtask")
async def get_task(task: Task):
    if not env:
        return "Environment unset, please send the map first"

    now = datetime.datetime.now(
        tz=datetime.timezone(datetime.timedelta(hours=8)))
    time = '[%s GMT+0800 (台北標準時間)]' % now.strftime('%a %b %d %Y %H:%M:%S')
    cmd = {"start": task.start, "stop": task.stop}
    with open("log.txt", "a") as logfile:
        logfile.write(
            time + json.dumps({"logs": "receive", "cmd": cmd}) + "\n")
    tasks_que.put(task)
    return "OK"


def do_task():
    global current_pos, next_pos
    global on_task, next_stop
    while 1:
        if not tasks_que.empty():
            try:
                task = tasks_que.get()
                on_task = True
                # start = (0, 0)
                start = coor_map[task.start]
                stops = [tuple(env.location.table[str(_)]) for _ in task.stop]
                next_stop_idx = 0
                next_stop = stops[next_stop_idx]

                shortest_path = find_path(env.maps, start, stops)
                print('path:', shortest_path, '\n')

                for i in range(len(shortest_path) - 1):
                    current_pos = shortest_path[i]
                    next_pos = shortest_path[i + 1]
                    print('cur pos:', current_pos)
                    print('next pos', next_pos, '\n')
                    if current_pos in stops:
                        cal_table()
                        wait_button()
                        next_stop_idx += 1
                        if next_stop_idx < len(stops):
                            next_stop = stops[next_stop_idx]
                    move_to_next(current_pos, next_pos)

                current_pos = next_pos
                next_pos, next_stop = start, start
                cal()
                wait_button()
                car.turn_around()
                reverse_path = bfs(env.maps, start, stops[-1])[0]
                reverse_path.reverse()
                reverse_path = [(-x, -y) for x, y in reverse_path]
                for i in range(len(reverse_path) - 1):
                    current_pos = reverse_path[i]
                    next_pos = reverse_path[i + 1]
                    move_to_next(current_pos, next_pos)
                current_pos = start
                cal()
                car.turn_around()
                now = datetime.datetime.now(
                    tz=datetime.timezone(datetime.timedelta(hours=8)))
                time_ = '[%s GMT+0800 (台北標準時間)]' % now.strftime(
                    '%a %b %d %Y %H:%M:%S')
                cmd = {"start": task.start, "stop": task.stop}
                with open("log.txt", "a") as logfile:
                    logfile.write(
                        time_ + json.dumps({"logs": "success", "cmd": cmd}) + "\n")

            except Exception as e:
                print('error:', e)
                pass
            finally:
                on_task = False
                next_pos, next_stop = None, None
                pass
    time.sleep(0.1)


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
            text = "x:" + str(x) + " z:" + \
                str(z) + " yaw:" + str(yaw)
            frame = cv2.putText(
                frame, text, (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 255), 1, cv2.LINE_AA)
            print(text)
            if yaw > 8:
                car.turn_left(num_steps=8)
            elif yaw < -10:
                car.turn_right(num_steps=8)
            elif x < 4:
                car.go_left(num_steps=50)
            elif x > 11:
                car.go_right(num_steps=50)
            elif z > 80:
                car.forward(num_steps=100)
            elif z < 75:
                car.backward(num_steps=30)
            else:
                cv2.destroyAllWindows()
                break
        except:
            pass

        cv2.imshow("frame", frame)
        key = cv2.waitKey(33)


def cal_table():
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
            text = "x:" + str(x) + " z:" + \
                str(z) + " yaw:" + str(yaw)
            frame = cv2.putText(
                frame, text, (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 255), 1, cv2.LINE_AA)
            print(text)

            if yaw > 8:
                car.turn_left(num_steps=8)
            elif yaw < -10:
                car.turn_right(num_steps=8)
            elif x < 4:
                car.go_left(num_steps=50)
            elif x > 9:
                car.go_right(num_steps=50)
            else:
                cv2.destroyAllWindows()
                break
        except:
            pass

        # cv2.imshow("frame", frame)
        key = cv2.waitKey(33)


def move_to_next(current_pos, next_pos):
    x_diff = next_pos[0] - current_pos[0]
    y_diff = next_pos[1] - current_pos[1]
    if x_diff > 0:
        car.forward(ultrasonic=use_sr04)
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


def find_path(map_array, start, stops, end=None):
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

        # p, cnt = bfs(map_array, st, end)
        # len_cnt += cnt
        # path += p[1:]

        if len_cnt < min_len:
            min_len = len_cnt
            final_path = path

    return final_path


if __name__ == "__main__":
    threading.Thread(target=lambda: do_task()).start()
    if use_sr04:
        threading.Thread(target=sr04.wrapper).start()
    print("server start")
    uvicorn.run(app, host="0.0.0.0", port=8000)
