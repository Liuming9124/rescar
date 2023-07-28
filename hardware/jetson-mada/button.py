import RPi.GPIO as GPIO

button_pin = 29

import os

def shutdown_jetson():
    try:
        os.system("sudo shutdown -h now")
    except Exception as e:
        print("Error while shutting down:", str(e))



def button_callback(channel):
    if not GPIO.input(channel):
        print("Button released")
    else:
        print('PRESSED')
        shutdown_jetson()
       


GPIO.setmode(GPIO.BOARD)
GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)


GPIO.add_event_detect(button_pin, GPIO.BOTH, callback=button_callback, bouncetime=200)

# Main loop
try:
    while True:
        pass

except KeyboardInterrupt:
    GPIO.cleanup()

GPIO.cleanup()