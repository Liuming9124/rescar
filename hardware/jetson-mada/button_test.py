import RPi.GPIO as GPIO
import time

BUTTON = 12
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON, GPIO.IN)
previousStatus = None

try:
    # while True:
    #     input = GPIO.input(BUTTON)
    #     if input == GPIO.LOW and previousStatus == GPIO.HIGH:
    #         print("Button pressed @", time.ctime())
    #     previousStatus = input
    while True:
        state = GPIO.input(BUTTON)
        if state:
            print("on")
            break
        else:
            print("off")
        time.sleep(1)

except KeyboardInterrupt:
    print("Exception: KeyboardInterrupt")

finally:
    GPIO.cleanup()
