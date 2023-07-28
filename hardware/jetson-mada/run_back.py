import RPi.GPIO as GPIO
import time

# 定义引脚
motor1_step_pin = 19   # 左前  35 
motor1_dir_pin = 26 # 37

motor2_step_pin =  4# 右前   7
motor2_dir_pin = 17 #11

motor3_step_pin = 20  # 左后 38
motor3_dir_pin = 21 #40

motor4_step_pin = 18  # 右后  12
motor4_dir_pin = 23 # 16

# 设置 GPIO 引脚为 BCM 模式
GPIO.setmode(GPIO.BCM)

# 设置引脚为输出
GPIO.setup(motor1_step_pin, GPIO.OUT)
GPIO.setup(motor1_dir_pin, GPIO.OUT)
GPIO.setup(motor2_step_pin, GPIO.OUT)
GPIO.setup(motor2_dir_pin, GPIO.OUT)
GPIO.setup(motor3_step_pin, GPIO.OUT)
GPIO.setup(motor3_dir_pin, GPIO.OUT)
GPIO.setup(motor4_step_pin, GPIO.OUT)
GPIO.setup(motor4_dir_pin, GPIO.OUT)

# 设定电机驱动控制参数
step_delay = 0.001  # 步进延迟，单位为秒
steps_per_rev = 200  # 电机每转所需步数
distance_per_step = 0.01  # 每步行进距离，单位为米

# 控制右后电机前进，左前、右前和左后电机停止
GPIO.output(motor1_dir_pin, GPIO.HIGH)
GPIO.output(motor2_dir_pin, GPIO.LOW)
GPIO.output(motor3_dir_pin, GPIO.HIGH)
GPIO.output(motor4_dir_pin, GPIO.LOW)

start_time = time.time()

# 无限循环控制电机前进和后退
while(1):
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

    # 控制右后电机停止
    GPIO.output(motor4_dir_pin, GPIO.LOW)
    GPIO.output(motor2_dir_pin, GPIO.LOW)
    GPIO.output(motor3_dir_pin, GPIO.HIGH)
    GPIO.output(motor1_dir_pin, GPIO.HIGH)
    time.sleep(1)

    

# 清理 GPIO 资源
GPIO.cleanup()