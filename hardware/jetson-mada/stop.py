import RPi.GPIO as GPIO
import time


motor1_step_pin = 19   # 左前  35 
motor1_dir_pin = 26 # 37

motor2_step_pin =  4# 右前   7
motor2_dir_pin = 17 #11

motor3_step_pin = 20  # 左后 38
motor3_dir_pin = 21 #40

motor4_step_pin = 18  # 右后  12
motor4_dir_pin = 23 # 16


GPIO.setmode(GPIO.BCM)


GPIO.setup(motor1_step_pin, GPIO.OUT)
GPIO.setup(motor1_dir_pin, GPIO.OUT)
GPIO.setup(motor2_step_pin, GPIO.OUT)
GPIO.setup(motor2_dir_pin, GPIO.OUT)
GPIO.setup(motor3_step_pin, GPIO.OUT)
GPIO.setup(motor3_dir_pin, GPIO.OUT)
GPIO.setup(motor4_step_pin, GPIO.OUT)
GPIO.setup(motor4_dir_pin, GPIO.OUT)


step_delay = 0.001  
steps_per_rev = 200  
distance_per_step = 0.01  


GPIO.output(motor1_dir_pin, GPIO.LOW)
GPIO.output(motor2_dir_pin, GPIO.LOW)
GPIO.output(motor3_dir_pin, GPIO.LOW)
GPIO.output(motor4_dir_pin, GPIO.LOW)


GPIO.cleanup()