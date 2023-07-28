import RPi.GPIO as GPIO
import time


GPIO.setmode(GPIO.BCM)

motor1_step_pin = 19   # 左前
motor1_dir_pin = 26

motor2_step_pin = 4   # 右前
motor2_dir_pin = 17

motor3_step_pin = 20  # 左后
motor3_dir_pin = 21

motor4_step_pin = 18  # 右后
motor4_dir_pin = 23

GPIO.setup(motor1_step_pin, GPIO.OUT)
GPIO.setup(motor1_dir_pin, GPIO.OUT)
GPIO.setup(motor2_step_pin, GPIO.OUT)
GPIO.setup(motor2_dir_pin, GPIO.OUT)
GPIO.setup(motor3_step_pin, GPIO.OUT)
GPIO.setup(motor3_dir_pin, GPIO.OUT)
GPIO.setup(motor4_step_pin, GPIO.OUT)
GPIO.setup(motor4_dir_pin, GPIO.OUT)

def back():
   
    step_delay = 0.001  # 多快
    steps_per_rev = 200  
    distance_per_step = 0.02  # 一次走多遠

    
    GPIO.output(motor1_dir_pin, GPIO.HIGH)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.HIGH)
    GPIO.output(motor4_dir_pin, GPIO.LOW)

    start_time = time.time()
    elapsed_time = 0
   
    while elapsed_time < 1:
        
        for i in range(steps_per_rev):
            GPIO.output(motor4_step_pin, GPIO.HIGH)
            GPIO.output(motor1_step_pin, GPIO.HIGH)
            GPIO.output(motor2_step_pin, GPIO.HIGH)
            GPIO.output(motor3_step_pin, GPIO.HIGH)
            time.sleep(step_delay)
            GPIO.output(motor4_step_pin, GPIO.LOW)
            GPIO.output(motor1_step_pin, GPIO.LOW)
            GPIO.output(motor2_step_pin, GPIO.LOW)
            GPIO.output(motor3_step_pin, GPIO.LOW)
            time.sleep(step_delay)
     
        elapsed_time = time.time() - start_time

   
    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.LOW)
    GPIO.output(motor4_dir_pin, GPIO.LOW)

def forward():
    
    step_delay = 0.005 
    steps_per_rev = 200  
    distance_per_step = 0.03 

   
    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.HIGH)
    GPIO.output(motor3_dir_pin, GPIO. LOW)
    GPIO.output(motor4_dir_pin,GPIO.HIGH)

    start_time = time.time()
    elapsed_time = 0

  
    while elapsed_time < 1:
        
        for i in range(steps_per_rev):
            GPIO.output(motor4_step_pin, GPIO.HIGH)
            GPIO.output(motor1_step_pin, GPIO.HIGH)
            GPIO.output(motor2_step_pin, GPIO.HIGH)
            GPIO.output(motor3_step_pin, GPIO.HIGH)
            time.sleep(step_delay)
            GPIO.output(motor4_step_pin, GPIO.LOW)
            GPIO.output(motor1_step_pin, GPIO.LOW)
            GPIO.output(motor2_step_pin, GPIO.LOW)
            GPIO.output(motor3_step_pin, GPIO.LOW)
            time.sleep(step_delay)

        elapsed_time = time.time() - start_time

    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.LOW)
    GPIO.output(motor4_dir_pin, GPIO.LOW)

   
    
def left():
    
    step_delay = 0.003 
    steps_per_rev = 253  
    distance_per_step = 0.01  


    GPIO.output(motor1_dir_pin, GPIO.HIGH)
    GPIO.output(motor2_dir_pin, GPIO.HIGH)
    GPIO.output(motor3_dir_pin, GPIO.LOW)
    GPIO.output(motor4_dir_pin, GPIO.LOW)

    start_time = time.time()
    elapsed_time = 0

    while elapsed_time < 1.5:
      
        for i in range(steps_per_rev):
            GPIO.output(motor1_step_pin, GPIO.HIGH)
            GPIO.output(motor4_step_pin, GPIO.HIGH)
            time.sleep(step_delay)
            GPIO.output(motor1_step_pin, GPIO.LOW)
            GPIO.output(motor4_step_pin, GPIO.LOW)
            time.sleep(step_delay)

      
        GPIO.output(motor1_step_pin, GPIO.LOW)
        GPIO.output(motor4_step_pin, GPIO.LOW)
        elapsed_time = time.time() - start_time

  
    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.LOW)
    GPIO.output(motor4_dir_pin, GPIO.LOW)

    GPIO.output(motor1_step_pin, GPIO.LOW)
    GPIO.output(motor2_step_pin, GPIO.LOW)
    GPIO.output(motor3_step_pin, GPIO.LOW)
    GPIO.output(motor4_step_pin, GPIO.LOW)    
    
def right():
    
    step_delay = 0.003 
    steps_per_rev = 260  
    distance_per_step = 0.01  
    

    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.HIGH)
    GPIO.output(motor4_dir_pin, GPIO.HIGH)

    start_time = time.time()
    elapsed_time = 0
    
    while elapsed_time <1.5 :
        
        for i in range(steps_per_rev):
            GPIO.output(motor2_step_pin, GPIO.HIGH)
            GPIO.output(motor3_step_pin, GPIO.HIGH)
            time.sleep(step_delay)
            GPIO.output(motor2_step_pin, GPIO.LOW)
            GPIO.output(motor3_step_pin, GPIO.LOW)
            time.sleep(step_delay)

        
        GPIO.output(motor2_step_pin, GPIO.LOW)
        GPIO.output(motor3_step_pin, GPIO.LOW)
        elapsed_time = time.time() - start_time

 
    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.LOW)
    GPIO.output(motor4_dir_pin, GPIO.LOW)

    GPIO.output(motor1_step_pin, GPIO.LOW)
    GPIO.output(motor2_step_pin, GPIO.LOW)
    GPIO.output(motor3_step_pin, GPIO.LOW)
    GPIO.output(motor4_step_pin, GPIO.LOW)

def stop():
   
    GPIO.output(motor1_step_pin, GPIO.LOW)
    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_step_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_step_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.LOW)
    GPIO.output(motor4_step_pin, GPIO.LOW)
    GPIO.output(motor4_dir_pin, GPIO.LOW)


if __name__ == "__main__":
    try:
        while 1:
            forward()
    except:
        pass
    finally:
        GPIO.cleanup()

