import time
import RPi.GPIO as GPIO


# GPIO.setmode(GPIO.BOARD)
# trig_pin = 22  # 22
# echo_pin = 18  # 18

# 禁止 GPIO 警告提示
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
trig_pin = 25  # 22
echo_pin = 24  # 18
distance = 0
stop = False
# 设置Trig和Echo引脚的方向
GPIO.setup(trig_pin, GPIO.OUT)
GPIO.setup(echo_pin, GPIO.IN)


def get_distance():
    global distance
    # 设置Trig引脚为输出方向
    GPIO.setup(trig_pin, GPIO.OUT)
    # 发送超声波信号并接收回波
    GPIO.output(trig_pin, True)
    time.sleep(0.00001)
    GPIO.output(trig_pin, False)

    start_time = time.time()
    while GPIO.input(echo_pin) == 0:
        if time.time() - start_time > 0.1:
            break
    start_time = time.time()

    while GPIO.input(echo_pin) == 1:
        if time.time() - start_time > 0.1:
            break
    end_time = time.time()

    # 计算距离
    duration = end_time - start_time
    distance = duration * 17150

    # 如果成功检测到距离，则返回距离值，否则返回None
    if distance > 0:
        return (distance)
    else:
        return None


def measure():
    GPIO.output(trig_pin, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(trig_pin, GPIO.LOW)
    pulse_start = time.time()
    while GPIO.input(echo_pin) == GPIO.LOW:
        pulse_start = time.time()
    while GPIO.input(echo_pin) == GPIO.HIGH:
        pulse_end = time.time()
    t = pulse_end - pulse_start
    d = t * 343
    d /= 2
    return d * 100


def sr04_stop():
    global stop
    stop = True
    return


def wrapper():
    global distance
    while (not stop):
        distance = get_distance()
        # print(distance)
        time.sleep(0.5)
    return


if __name__ == "__main__":
    try:
        while True:
            print(get_distance())
            # print(measure())
            time.sleep(0.1)
    except:
        pass
    finally:
        GPIO.cleanup()
