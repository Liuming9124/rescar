import numpy as np
from car import CAR
import numpy as np
import cv2
import time
import math

cap = cv2.VideoCapture(0)
dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_6X6_250)
parameters = cv2.aruco.DetectorParameters()
detector = cv2.aruco.ArucoDetector(dictionary, parameters)

key = 0
fs = cv2.FileStorage("output.xml", cv2.FILE_STORAGE_READ)
intrinsic = fs.getNode("intrinsic").mat()
distortion = fs.getNode("distortion").mat()

car = CAR()


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
        text = "x:" + str(x)+" y:" + str(y)+" z:" + str(z) + "yaw:" + str(yaw)
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

    except:
        pass

    cv2.imshow("frame", frame)
    key = cv2.waitKey(33)
    # cv2.destroyAllWindows()
