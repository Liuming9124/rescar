import time
import numpy as np
import cv2
import math
import heapq
import threading
import RPi.GPIO as GPIO
# import hc_sro04 as sr04
from car import CAR

cap = cv2.VideoCapture(0)
dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_6X6_250)
parameters = cv2.aruco.DetectorParameters()
detector = cv2.aruco.ArucoDetector(dictionary, parameters)

fs = cv2.FileStorage("output.xml", cv2.FILE_STORAGE_READ)
intrinsic = fs.getNode("intrinsic").mat()
distortion = fs.getNode("distortion").mat()
car = CAR()


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


def move(direction):
    if direction == "forward":
        car.forward()
    elif direction == "left":
        car.go_left()
    elif direction == "right":
        car.go_right()
    elif direction == "backward":
        car.backward()
    else:
        print("Invalid direction")


def dijkstra(start, end, graph):
    # distances存储起点到每个节点的最短距离
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    # heap存储待访问节点
    heap = [(0, start)]
    # path存储每个节点的前一个节点
    path = {start: None}
    while heap:
        (distance, current_node) = heapq.heappop(heap)
        if distance > distances[current_node]:
            continue
        if current_node == end:
            break
        for neighbor, weight in graph[current_node].items():
            new_distance = distances[current_node] + weight
            if new_distance < distances[neighbor]:
                distances[neighbor] = new_distance
                heapq.heappush(heap, (new_distance, neighbor))
                path[neighbor] = current_node
    # 从终点反向遍历每个节点，得到最短路径
    shortest_path = []
    node = end
    while node is not None:
        shortest_path.append(node)
        node = path[node]
    shortest_path.reverse()
    return shortest_path


if __name__ == "__main__":
    # t1 = threading.Thread(target=sr04.wrapper)  # sr04
    # t1.start()

    try:
        # 定义地图
        map = {}
        matrix = [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 0, 1],
            [0, 0, 1, 1, 1]
        ]
        n = len(matrix)
        m = len(matrix[0])
        for i in range(n):
            for j in range(m):
                if matrix[i][j] == 1:
                    neighbors = {}
                    if i > 0 and matrix[i - 1][j] == 1:
                        neighbors[(i - 1, j)] = 1
                    if i < n - 1 and matrix[i + 1][j] == 1:
                        neighbors[(i + 1, j)] = 1
                    if j > 0 and matrix[i][j - 1] == 1:
                        neighbors[(i, j - 1)] = 1
                    if j < m - 1 and matrix[i][j + 1] == 1:
                        neighbors[(i, j + 1)] = 1
                    map[(i, j)] = neighbors

        # 起点和终点
        start = (0, 0)
        end = (2, 1)

        # 使用Dijkstra算法求最短路径
        shortest_path = dijkstra(start, end, map)

        # 输出最短路径上经过每个节点的坐标
        print(shortest_path)

        # 按照最短路径移动
        for i in range(len(shortest_path) - 1):
            current_pos = shortest_path[i]
            next_pos = shortest_path[i + 1]
            move_to_next(current_pos, next_pos)

        cal()  # 走完校正
        car.turn_around()
        shortest_path.reverse()
        reverse_path = [(-x, -y) for x, y in shortest_path]
        print(reverse_path)
        for i in range(len(reverse_path) - 1):
            current_pos = reverse_path[i]
            next_pos = reverse_path[i + 1]
            move_to_next(current_pos, next_pos)

        cal()
        car.turn_around()

    except:
        print('error')
        pass
    finally:
        # sr04.sr04_stop()
        GPIO.cleanup()
