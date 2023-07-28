import numpy as np
from car import CAR
import cv2

cap = cv2.VideoCapture(0)
car = CAR()
key = 0
while key != ord('q'):
    ret, frame = cap.read()
    cv2.imshow("frame", frame)
    key = cv2.waitKey(33)
    if key != -1:
        if key == ord('w'):
            car.forward(num_steps=20, step_delay=.001)
        if key == ord('s'):
            car.backward(num_steps=20, step_delay=.001)
        if key == ord('a'):
            car.go_left(num_steps=20, step_delay=.001)
        if key == ord('d'):
            car.go_right(num_steps=20, step_delay=.001)
        if key == ord('v'):
            car.turn_right(num_steps=20, step_delay=.001)
        if key == ord('c'):
            car.turn_left(num_steps=20, step_delay=.001)