import RPi.GPIO as GPIO
import threading
import time
import sys
import hc_sro04 as sr04


def degree_calc(steps, steptype):
    """ calculate and returns size of turn in degree
    , passed number of steps and steptype"""
    degree_value = {'Full': 1.8,
                    'Half': 0.9,
                    '1/4': .45,
                    '1/8': .225,
                    '1/16': 0.1125,
                    '1/32': 0.05625,
                    '1/64': 0.028125,
                    '1/128': 0.0140625}
    degree_value = (steps*degree_value[steptype])
    return degree_value


def importtest(text):
    """ testing import """
    # print(text)
    text = " "


class StopMotorInterrupt(Exception):
    """ Stop the motor """
    pass


class A4988Nema(object):
    """ Class to control a Nema bi-polar stepper motor with a A4988 also tested with DRV8825"""

    def __init__(self, direction_pin, step_pin, mode_pins, motor_type="A4988"):
        """ class init method 3 inputs
        (1) direction type=int , help=GPIO pin connected to DIR pin of IC
        (2) step_pin type=int , help=GPIO pin connected to STEP of IC
        (3) mode_pins type=tuple of 3 ints, help=GPIO pins connected to
        Microstep Resolution pins MS1-MS3 of IC, can be set to (-1,-1,-1) to turn off
        GPIO resolution.
        (4) motor_type type=string, help=Type of motor two options: A4988 or DRV8825
        """
        self.motor_type = motor_type
        self.direction_pin = direction_pin
        self.step_pin = step_pin

        if mode_pins[0] != -1:
            self.mode_pins = mode_pins
        else:
            self.mode_pins = False

        self.stop_motor = False
        GPIO.setwarnings(False)

    def motor_stop(self):
        """ Stop the motor """
        self.stop_motor = True

    def motor_start(self):
        """ Stop the motor """
        self.stop_motor = False

    def resolution_set(self, steptype):
        """ method to calculate step resolution
        based on motor type and steptype"""
        if self.motor_type == "A4988":
            resolution = {'Full': (0, 0, 0),
                          'Half': (1, 0, 0),
                          '1/4': (0, 1, 0),
                          '1/8': (1, 1, 0),
                          '1/16': (1, 1, 1)}
        elif self.motor_type == "DRV8825":
            resolution = {'Full': (0, 0, 0),
                          'Half': (1, 0, 0),
                          '1/4': (0, 1, 0),
                          '1/8': (1, 1, 0),
                          '1/16': (0, 0, 1),
                          '1/32': (1, 0, 1)}
        elif self.motor_type == "LV8729":
            resolution = {'Full': (0, 0, 0),
                          'Half': (1, 0, 0),
                          '1/4': (0, 1, 0),
                          '1/8': (1, 1, 0),
                          '1/16': (0, 0, 1),
                          '1/32': (1, 0, 1),
                          '1/64': (0, 1, 1),
                          '1/128': (1, 1, 1)}
        else:
            print("Error invalid motor_type: {}".format(self.motor_type))
            quit()

        # error check stepmode
        if steptype in resolution:
            pass
        else:
            print("Error invalid steptype: {}".format(steptype))
            quit()

        if self.mode_pins != False:
            GPIO.output(self.mode_pins, resolution[steptype])

    def motor_go(self, clockwise=False, steptype="Full",
                 steps=200, stepdelay=.05, verbose=False, initdelay=.005):
        """ motor_go,  moves stepper motor based on 6 inputs

         (1) clockwise, type=bool default=False
         help="Turn stepper counterclockwise"
         (2) steptype, type=string , default=Full help= type of drive to
         step motor 5 options
            (Full, Half, 1/4, 1/8, 1/16) 1/32 for DRV8825 only
         (3) steps, type=int, default=200, help=Number of steps sequence's
         to execute. Default is one revolution , 200 in Full mode.
         (4) stepdelay, type=float, default=0.05, help=Time to wait
         (in seconds) between steps.
         (5) verbose, type=bool  type=bool default=False
         help="Write pin actions",
         (6) initdelay, type=float, default=1mS, help= Intial delay after
         GPIO pins initialized but before motor is moved.

        """
        self.stop_motor = False
        # setup GPIO
        GPIO.setup(self.direction_pin, GPIO.OUT)
        GPIO.setup(self.step_pin, GPIO.OUT)
        GPIO.output(self.direction_pin, clockwise)
        if self.mode_pins != False:
            GPIO.setup(self.mode_pins, GPIO.OUT)

        try:
            # dict resolution
            self.resolution_set(steptype)
            time.sleep(initdelay)

            for i in range(steps):
                # if self.stop_motor:
                #     raise StopMotorInterrupt
                # else:
                #     GPIO.output(self.step_pin, True)
                #     time.sleep(stepdelay)
                #     GPIO.output(self.step_pin, False)
                #     time.sleep(stepdelay)
                #     if verbose:
                #         print("Steps count {}".format(
                #             i+1), end="\r", flush=True)
                while self.stop_motor:
                    pass
                GPIO.output(self.step_pin, True)
                time.sleep(stepdelay)
                GPIO.output(self.step_pin, False)
                time.sleep(stepdelay)

        except KeyboardInterrupt:
            print("User Keyboard Interrupt : RpiMotorLib:")
        except StopMotorInterrupt:
            print("Stop Motor Interrupt : RpiMotorLib: ")
        except Exception as motor_error:
            print(sys.exc_info()[0])
            print(motor_error)
            print("RpiMotorLib  : Unexpected error:")
        else:
            # print report status
            if verbose:
                print("\nRpiMotorLib, Motor Run finished, Details:.\n")
                print("Motor type = {}".format(self.motor_type))
                print("Clockwise = {}".format(clockwise))
                print("Step Type = {}".format(steptype))
                print("Number of steps = {}".format(steps))
                print("Step Delay = {}".format(stepdelay))
                print("Intial delay = {}".format(initdelay))
                print("Size of turn in degrees = {}"
                      .format(degree_calc(steps, steptype)))
        finally:
            # cleanup
            GPIO.output(self.step_pin, False)
            GPIO.output(self.direction_pin, False)
            if self.mode_pins != False:
                for pin in self.mode_pins:
                    GPIO.output(pin, False)


class CAR(object):
    def __init__(self):
        GPIO.setmode(GPIO.BCM)
        self.stop = False
        self.motor1_step_pin = 19  # 右後 35
        self.motor1_dir_pin = 26  # 37
        self.motor2_step_pin = 4   # 左後 7
        self.motor2_dir_pin = 17  # 11
        self.motor3_step_pin = 20  # 右前 38
        self.motor3_dir_pin = 21  # 40
        self.motor4_step_pin = 18  # 左前 12
        self.motor4_dir_pin = 23  # 16
        self.motor1 = A4988Nema(
            self.motor1_dir_pin, self.motor1_step_pin, (-1, -1, -1), "DRV8825")
        self.motor2 = A4988Nema(
            self.motor2_dir_pin, self.motor2_step_pin, (-1, -1, -1), "DRV8825")
        self.motor3 = A4988Nema(
            self.motor3_dir_pin, self.motor3_step_pin, (-1, -1, -1), "DRV8825")
        self.motor4 = A4988Nema(
            self.motor4_dir_pin, self.motor4_step_pin, (-1, -1, -1), "DRV8825")

    def backward(self, num_steps=400, step_delay=.005):
        threads = [threading.Thread(target=lambda: self.motor1.motor_go(
            False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor2.motor_go(
                True, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor3.motor_go(
                False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor4.motor_go(
                True, "Full", num_steps, step_delay, False))]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        return

    def forward(self, num_steps=400, step_delay=.005, ultrasonic=False):
        threads = [threading.Thread(target=lambda: self.motor1.motor_go(
            True, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor2.motor_go(
                False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor3.motor_go(
                True, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor4.motor_go(
                False, "Full", num_steps, step_delay, False))]

        for thread in threads:
            thread.start()

        if ultrasonic:
            while any(thread.is_alive() for thread in threads):
                # print(sr04.distance)
                while sr04.distance < 30:
                    self.motor1.motor_stop()
                    self.motor2.motor_stop()
                    self.motor3.motor_stop()
                    self.motor4.motor_stop()
                    time.sleep(1)

                self.motor1.motor_start()
                self.motor2.motor_start()
                self.motor3.motor_start()
                self.motor4.motor_start()
                time.sleep(0.1)
        else:
            for thread in threads:
                thread.join()
        return

    def turn_right(self, num_steps=200, step_delay=.005):
        threads = [
            threading.Thread(target=lambda: self.motor1.motor_go(
                True, "Full",  num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor2.motor_go(
                True, "Full", 2 * num_steps, step_delay / 2, False)),
            threading.Thread(target=lambda: self.motor3.motor_go(
                True, "Full", 2 * num_steps, step_delay / 2, False)),
            threading.Thread(target=lambda: self.motor4.motor_go(
                True, "Full",  num_steps, step_delay, False))]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        return

    def turn_left(self, num_steps=165, step_delay=.005):
        threads = [threading.Thread(target=lambda: self.motor4.motor_go(
            False, "Full", 2 * num_steps, step_delay / 2, False)),
            threading.Thread(target=lambda: self.motor1.motor_go(
                False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor2.motor_go(
                False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor3.motor_go(
                False, "Full", 2 * num_steps, step_delay / 2, False))]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        return

    def go_left(self, num_steps=300, step_delay=.005):
        threads = [
            threading.Thread(target=lambda: self.motor1.motor_go(
                False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor2.motor_go(
                False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor3.motor_go(
                True, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor4.motor_go(
                True, "Full", num_steps, step_delay, False))]

        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        return

    def go_right(self, num_steps=300, step_delay=.005):

        threads = [
            threading.Thread(target=lambda: self.motor1.motor_go(
                True, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor2.motor_go(
                True, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor3.motor_go(
                False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor4.motor_go(
                False, "Full", num_steps, step_delay, False))]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        return

    def turn_around(self, num_steps=320, step_delay=.005):
        threads = [threading.Thread(target=lambda: self.motor4.motor_go(
            False, "Full", 2 * num_steps, step_delay / 2, False)),
            threading.Thread(target=lambda: self.motor1.motor_go(
                False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor2.motor_go(
                False, "Full", num_steps, step_delay, False)),
            threading.Thread(target=lambda: self.motor3.motor_go(
                False, "Full", 2 * num_steps, step_delay / 2, False))]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        return

    def check(self):
        print(sr04.distance)
        return


if __name__ == "__main__":
    try:
        t1 = threading.Thread(target=sr04.wrapper)  # sr04
        t1.start()
        car = CAR()
        for _ in range(5):
            car.forward(ultrasonic=True)
            car.backward()
            car.go_right()
            car.go_left()
        sr04.sr04_stop()
    except:
        pass
    finally:
        GPIO.cleanup()
