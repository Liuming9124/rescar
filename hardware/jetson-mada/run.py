import RPi.GPIO as GPIO
import time

# 设置 GPIO 引脚为 BCM 模式
GPIO.setmode(GPIO.BCM)

motor1_step_pin = 19   # 左前
motor1_dir_pin = 26

motor2_step_pin = 4   # 右前
motor2_dir_pin = 17

motor3_step_pin = 20  # 左后
motor3_dir_pin = 21

motor4_step_pin = 18  # 右后
motor4_dir_pin = 23

# 设置引脚为输出
GPIO.setup(motor1_step_pin, GPIO.OUT)
GPIO.setup(motor1_dir_pin, GPIO.OUT)
GPIO.setup(motor2_step_pin, GPIO.OUT)
GPIO.setup(motor2_dir_pin, GPIO.OUT)
GPIO.setup(motor3_step_pin, GPIO.OUT)
GPIO.setup(motor3_dir_pin, GPIO.OUT)
GPIO.setup(motor4_step_pin, GPIO.OUT)
GPIO.setup(motor4_dir_pin, GPIO.OUT)

def back():
    # 设定电机驱动控制参数
    step_delay = 0.001  # 多快
    steps_per_rev = 200  # 电机每转所需步数
    distance_per_step = 0.02  # 一次走多遠

    # 控制右后电机前进，左前、右前和左后电机停止
    GPIO.output(motor1_dir_pin, GPIO.HIGH)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.HIGH)
    GPIO.output(motor4_dir_pin, GPIO.LOW)

    start_time = time.time()
    elapsed_time = 0
    # 无限循环控制电机前进和后退
    while elapsed_time < 1:
        # 控制右后电机前进
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

     # 关闭所有电机
    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.LOW)
    GPIO.output(motor4_dir_pin, GPIO.LOW)

def forward():
    # 设定电机驱动控制参数
    step_delay = 0.005 # 步进延迟，单位为秒
    steps_per_rev = 200  # 电机每转所需 步数
    distance_per_step = 0.03 # 每步行进距离，单位为米

    # 控制右后电机前进，左前、右前和左后电机停止
    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.HIGH)
    GPIO.output(motor3_dir_pin, GPIO. LOW)
    GPIO.output(motor4_dir_pin,GPIO.HIGH)

    start_time = time.time()
    elapsed_time = 0

    # 无限循环控制电机前进和后退
    while elapsed_time < 1:
        # 控制右后电机前进
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
    # 设定电机驱动控制参数
    step_delay = 0.003 # 步进延迟，单位为秒
    steps_per_rev = 253  # 电机每转所需步数
    distance_per_step = 0.01  # 每步行进距离，单位为米

    # 控制左前和右后电机前进，左后和右前电机停止
    GPIO.output(motor1_dir_pin, GPIO.HIGH)
    GPIO.output(motor2_dir_pin, GPIO.HIGH)
    GPIO.output(motor3_dir_pin, GPIO.LOW)
    GPIO.output(motor4_dir_pin, GPIO.LOW)

    start_time = time.time()
    elapsed_time = 0
    # 无限循环控制电机前进和后退
    while elapsed_time < 1.5:
        # 控制左前和右后电机前进
        for i in range(steps_per_rev):
            GPIO.output(motor1_step_pin, GPIO.HIGH)
            GPIO.output(motor4_step_pin, GPIO.HIGH)
            time.sleep(step_delay)
            GPIO.output(motor1_step_pin, GPIO.LOW)
            GPIO.output(motor4_step_pin, GPIO.LOW)
            time.sleep(step_delay)

        # 控制左前和右后电机停止
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
    # 设定电机驱动控制参数
    step_delay = 0.003 # 步进延迟，单位为秒
    steps_per_rev = 260  # 电机每转所需步数
    distance_per_step = 0.01  # 每步行进距离，单位为米
    
    # 控制右前和左后电机前进，左前和右后电机停止
    GPIO.output(motor1_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.HIGH)
    GPIO.output(motor4_dir_pin, GPIO.HIGH)

    start_time = time.time()
    elapsed_time = 0
    # 无限循环控制电机前进和后退
    while elapsed_time <1.5 :
        # 控制右前和左后电机前进
        for i in range(steps_per_rev):
            GPIO.output(motor2_step_pin, GPIO.HIGH)
            GPIO.output(motor3_step_pin, GPIO.HIGH)
            time.sleep(step_delay)
            GPIO.output(motor2_step_pin, GPIO.LOW)
            GPIO.output(motor3_step_pin, GPIO.LOW)
            time.sleep(step_delay)

        # 控制右前和左后电机停止
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
    # 将所有电机控制引脚设置为低电平
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

