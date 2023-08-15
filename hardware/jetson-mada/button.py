import RPi.GPIO as GPIO
import os

# def shutdown_jetson():
#     try:
#         os.system("sudo shutdown -h now")
#     except Exception as e:
#         print("Error while shutting down:", str(e))

go = True

def button_callback(channel):
    if not GPIO.input(channel):
        print("Button released")
    else:
        global go
        go = True
        print('PRESSED')
        # shutdown_jetson()


# Set up GPIO mode and button pin
button_pin = 29
GPIO.setmode(GPIO.BOARD)
GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(button_pin, GPIO.BOTH,
                      callback=button_callback, bouncetime=200)
if __name__ == "__name__":
    # Add event detection for button press and release
    try:
        while True:
            pass

    except KeyboardInterrupt:
        print('end')
    finally:
        GPIO.cleanup()
