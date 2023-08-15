import numpy as np
import cv2

# cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # device
cap = cv2.VideoCapture(0)

# dictionary = cv2.aruco.Dictionary_get(cv2.aruco.DICT_6X6_250)
dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_6X6_250)
parameters = cv2.aruco.DetectorParameters()
detector = cv2.aruco.ArucoDetector(dictionary, parameters)

key = 0
fs = cv2.FileStorage("output.xml", cv2.FILE_STORAGE_READ)
intrinsic = fs.getNode("intrinsic").mat()
distortion = fs.getNode("distortion").mat()


while key != ord('q'):
    ret, frame = cap.read()
    markerCorners, markerIds, rejectedCandidates = detector.detectMarkers(
        frame)

    ids, idx = None, None
    # print(type(markerIds))
    if markerIds != None:
        ids = markerIds.ravel()
        idx = np.argmin(ids)

    # markerCorners, markerIds, rejectedCandidates = cv2.aruco.detectMarkers(
    #     frame, dictionary, parameters=parameters)
    frame = cv2.aruco.drawDetectedMarkers(frame, markerCorners, markerIds)
    rvec, tvec, _objPoints = cv2.aruco.estimatePoseSingleMarkers(
        markerCorners, 18.5, intrinsic, distortion)

    try:
        # frame = cv2.aruco.drawAxis(
        #     frame, intrinsic, distortion, rvec, tvec, 0.1)
        print(tvec.shape)
        text = "x:"+str(round(tvec[idx][0][0], 3))+" y:"+str(
            round(tvec[idx][0][1], 3))+" z:"+str(round(tvec[idx][0][2], 3))
        # x, y, z = tvec[1][0][0], tvec[1][0][1], tvec[1][0][2]
        print(text)
        frame = cv2.putText(
            frame, text, (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 255), 1, cv2.LINE_AA)
    except:
        pass

    cv2.imshow("drone", frame)
    key = cv2.waitKey(33)
    # cv2.destroyAllWindows()
