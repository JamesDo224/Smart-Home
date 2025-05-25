from yolobit import *
button_a.on_pressed = None
button_b.on_pressed = None
button_a.on_pressed_ab = button_b.on_pressed_ab = -1
from mqtt import *
from machine import RTC
import ntptime
import time
from aiot_lcd1602 import LCD1602
from aiot_rgbled import RGBLed
from event_manager import *
from machine import Pin, SoftI2C
from homebit3_dht20 import DHT20
import music
from mq import MQ

aiot_lcd1602 = LCD1602()

def on_mqtt_message_receive_callback__AIR_QUALITY_MONITORING_(th_C3_B4ng_tin):
  global lux, AQM_mode, FD_mode, conc, light_mode, th_C3_B4ng_tin_2, th_C3_B4ng_tin_3, th_C3_B4ng_tin_4
  if th_C3_B4ng_tin == '1':
    AQM_mode = 1
  else:
    AQM_mode = 0

def on_mqtt_message_receive_callback__FIRE_DETECTION_(th_C3_B4ng_tin_2):
  global lux, AQM_mode, FD_mode, conc, light_mode, th_C3_B4ng_tin, th_C3_B4ng_tin_3, th_C3_B4ng_tin_4
  if th_C3_B4ng_tin_2 == '1':
    FD_mode = 1
  else:
    FD_mode = 0

tiny_rgb = RGBLed(pin2.pin, 4)

def on_mqtt_message_receive_callback__SET_eLIGHT_(th_C3_B4ng_tin_3):
  global lux, AQM_mode, FD_mode, conc, light_mode, th_C3_B4ng_tin, th_C3_B4ng_tin_2, th_C3_B4ng_tin_4
  if th_C3_B4ng_tin_3 == '1' and light_mode == 0:
    tiny_rgb.show(0, hex_to_rgb('#ffa500'))
    time.sleep_ms(1000)
    tiny_rgb.show(0, hex_to_rgb('#ffff00'))
    time.sleep_ms(3000)
    tiny_rgb.show(0, hex_to_rgb('#ffffff'))
    light_mode = 1
  else:
    tiny_rgb.show(0, hex_to_rgb('#000000'))
    light_mode = 0

def on_mqtt_message_receive_callback__SET_eMOTOR_(th_C3_B4ng_tin_4):
  global lux, AQM_mode, FD_mode, conc, light_mode, th_C3_B4ng_tin, th_C3_B4ng_tin_2, th_C3_B4ng_tin_3
  if th_C3_B4ng_tin_4 == '1':
    pin4.servo360_write(100)
    time.sleep_ms(5000)
    pin4.servo360_write(0)
    time.sleep_ms(1000)
  else:
    pin4.servo360_write((-100))
    time.sleep_ms(4000)
    pin4.servo360_write(0)
    time.sleep_ms(1000)

def on_mqtt_message_receive_callback__SET_SERVO_(th_C3_B4ng_tin_2):
  global lux, AQM_mode, FD_mode, conc, light_mode, th_C3_B4ng_tin, th_C3_B4ng_tin_3, th_C3_B4ng_tin_4
  if th_C3_B4ng_tin_2 == '1':
    pin7.servo_write(110)
  else:
    pin7.servo_write(180)

event_manager.reset()

dht20 = DHT20()

def on_event_timer_callback_L_o_E_X_o():
  global lux, AQM_mode, FD_mode, conc, light_mode, th_C3_B4ng_tin, th_C3_B4ng_tin_2, th_C3_B4ng_tin_3, th_C3_B4ng_tin_4
  if AQM_mode == 1:
    aiot_lcd1602.clear()
    aiot_lcd1602.move_to(0, 0)
    aiot_lcd1602.putstr('TEMP: ')
    aiot_lcd1602.move_to(10, 0)
    aiot_lcd1602.putstr(' ')
    aiot_lcd1602.move_to(10, 0)
    aiot_lcd1602.putstr((str(dht20.dht20_temperature()) + '*C'))
    aiot_lcd1602.move_to(0, 1)
    aiot_lcd1602.putstr('HUMI: ')
    aiot_lcd1602.move_to(10, 1)
    aiot_lcd1602.putstr(' ')
    aiot_lcd1602.move_to(10, 1)
    aiot_lcd1602.putstr((str(dht20.dht20_humidity()) + '%'))
    time.sleep_ms(7500)
    aiot_lcd1602.clear()
    aiot_lcd1602.move_to(0, 0)
    aiot_lcd1602.putstr('LIGHT: ')
    aiot_lcd1602.move_to(10, 0)
    aiot_lcd1602.putstr(' ')
    aiot_lcd1602.move_to(10, 0)
    aiot_lcd1602.putstr((str(lux) + 'lux'))
    aiot_lcd1602.move_to(0, 1)
    aiot_lcd1602.putstr(('%0*d' % (2, RTC().datetime()[2])))
    aiot_lcd1602.move_to(2, 1)
    aiot_lcd1602.putstr('/')
    aiot_lcd1602.move_to(3, 1)
    aiot_lcd1602.putstr(('%0*d' % (2, RTC().datetime()[1])))
    aiot_lcd1602.move_to(5, 1)
    aiot_lcd1602.putstr('/')
    aiot_lcd1602.move_to(6, 1)
    aiot_lcd1602.putstr(('%0*d' % (2, RTC().datetime()[0])))
    aiot_lcd1602.move_to(10, 1)
    aiot_lcd1602.putstr(' ')
    aiot_lcd1602.move_to(11, 1)
    aiot_lcd1602.putstr(('%0*d' % (2, RTC().datetime()[4])))
    aiot_lcd1602.move_to(13, 1)
    aiot_lcd1602.putstr(':')
    aiot_lcd1602.move_to(14, 1)
    aiot_lcd1602.putstr(('%0*d' % (2, RTC().datetime()[5])))
    time.sleep_ms(2000)
    aiot_lcd1602.move_to(0, 0)
    aiot_lcd1602.putstr('                ')
    aiot_lcd1602.move_to(0, 0)
    aiot_lcd1602.putstr('AIR: ')
    aiot_lcd1602.move_to(8, 0)
    aiot_lcd1602.putstr(' ')
    aiot_lcd1602.move_to(8, 0)
    aiot_lcd1602.putstr((str(conc) + 'mg/l'))
  else:
    aiot_lcd1602.clear()
    aiot_lcd1602.move_to(0, 0)
    aiot_lcd1602.putstr('AQM DISABLED !')
    time.sleep_ms(1000)
    aiot_lcd1602.move_to(0, 1)
    aiot_lcd1602.putstr('                ')
    aiot_lcd1602.move_to(0, 1)
    aiot_lcd1602.putstr('LOANDING')
    time.sleep_ms(1000)
    aiot_lcd1602.move_to(0, 1)
    aiot_lcd1602.putstr('LOANDING.')
    time.sleep_ms(1000)
    aiot_lcd1602.move_to(0, 1)
    aiot_lcd1602.putstr('LOANDING..')
    time.sleep_ms(1000)
    aiot_lcd1602.move_to(0, 1)
    aiot_lcd1602.putstr('LOANDING...')

event_manager.add_timer_event(15000, on_event_timer_callback_L_o_E_X_o)

def sound_alarm():
  for count in range(5):
    music.play(['A5:1'], wait=True)
    music.play(['E5:1'], wait=True)

def on_event_timer_callback_l_B_Q_j_P():
  global lux, AQM_mode, FD_mode, conc, light_mode, th_C3_B4ng_tin, th_C3_B4ng_tin_2, th_C3_B4ng_tin_3, th_C3_B4ng_tin_4
  if FD_mode == 1:
    if (dht20.dht20_temperature()) >= 27:
      pin3.write_digital((1))
      sound_alarm()
      light_mode = 0
      tiny_rgb.show(0, hex_to_rgb('#ff0000'))
      time.sleep_ms(1500)
      tiny_rgb.show(0, hex_to_rgb('#0000ff'))
    else:
      if light_mode == 0:
        tiny_rgb.show(0, hex_to_rgb('#000000'))
      pin3.write_digital((0))
  else:
    pin3.write_digital((0))
    tiny_rgb.show(0, hex_to_rgb('#000000'))

event_manager.add_timer_event(3000, on_event_timer_callback_l_B_Q_j_P)

mq = MQ(Pin(pin1.adc_pin)) # analog PIN

def on_event_timer_callback_B_Y_g_x_I():
  global lux, AQM_mode, FD_mode, conc, light_mode, th_C3_B4ng_tin, th_C3_B4ng_tin_2, th_C3_B4ng_tin_3, th_C3_B4ng_tin_4
  dht20.read_dht20()
  lux = round(translate((pin0.read_analog()), 0, 4095, 0, 100))
  conc = mq.get_acohol()
  if AQM_mode == 1:
    mqtt.publish('HUMI', (dht20.dht20_humidity()))
    mqtt.publish('TEMP', (dht20.dht20_temperature()))
    mqtt.publish('LIGHT', lux)
    mqtt.publish('CONC', conc)

event_manager.add_timer_event(15000, on_event_timer_callback_B_Y_g_x_I)

if True:
  display.scroll('AIOT')
  mqtt.connect_wifi('ACLAB', 'ACLAB2023')
  mqtt.connect_broker(server='io.adafruit.com', port=1883, username='Anhdo020204', password='aio_BXhj736qyMLQDGfjvL09czjE0G9R')
  ntptime.settime()
  (year, month, mday, week_of_year, hour, minute, second, milisecond) = RTC().datetime()
  RTC().init((year, month, mday, week_of_year, hour+7, minute, second, milisecond))
  display.scroll('READY!')
  time.sleep_ms(1000)
  AQM_mode = 1
  FD_mode = 1
  light_mode = 0
  aiot_lcd1602.clear()
  aiot_lcd1602.move_to(0, 0)
  aiot_lcd1602.putstr('AQM Activated !')
  time.sleep_ms(1000)
  aiot_lcd1602.move_to(0, 1)
  aiot_lcd1602.putstr('FD Activated !')
  mqtt.on_receive_message('AIR QUALITY MONITORING', on_mqtt_message_receive_callback__AIR_QUALITY_MONITORING_)
  mqtt.on_receive_message('FIRE DETECTION', on_mqtt_message_receive_callback__FIRE_DETECTION_)
  mqtt.on_receive_message('SET eLIGHT', on_mqtt_message_receive_callback__SET_eLIGHT_)
  mqtt.on_receive_message('SET eMOTOR', on_mqtt_message_receive_callback__SET_eMOTOR_)
  mqtt.on_receive_message('SET SERVO', on_mqtt_message_receive_callback__SET_SERVO_)

while True:
  mqtt.check_message()
  event_manager.run()
  time.sleep_ms(1000)
  time.sleep_ms(10)
