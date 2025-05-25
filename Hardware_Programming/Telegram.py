from yolobit import *
button_a.on_pressed = None
button_b.on_pressed = None
button_a.on_pressed_ab = button_b.on_pressed_ab = -1
from mqtt import *
import time
import urequests
import gc

def on_mqtt_message_receive_callback__TELEGRAM_(th_C3_B4ng_tin):
  global http_response
  if th_C3_B4ng_tin == '1':
    gc.collect()
    http_response = urequests.get((''.join([str(x) for x in ['https://api.telegram.org/bot', '8087844916:AAGFhbRKyjqyMRMQHvfeZHPvass2KXO8Pto', '/sendMessage?text=', 'Fire Detected! <<Evacuate your home immediately>>', '&chat_id=', '-4703309099']])))
  if th_C3_B4ng_tin == '2':
    gc.collect()
    http_response = urequests.get((''.join([str(x) for x in ['https://api.telegram.org/bot', '8087844916:AAGFhbRKyjqyMRMQHvfeZHPvass2KXO8Pto', '/sendMessage?text=', 'High Humidity! <<Maybe you should: Close the Window to improve the Air Quality>>', '&chat_id=', '-4703309099']])))
  if th_C3_B4ng_tin == '3':
    gc.collect()
    http_response = urequests.get((''.join([str(x) for x in ['https://api.telegram.org/bot', '8087844916:AAGFhbRKyjqyMRMQHvfeZHPvass2KXO8Pto', '/sendMessage?text=', 'Low Light Intensity! <<Maybe you should: Open the Curtain and Turn on the Lights to improve the Light Quality>>', '&chat_id=', '-4703309099']])))
  if th_C3_B4ng_tin == '4':
    gc.collect()
    http_response = urequests.get((''.join([str(x) for x in ['https://api.telegram.org/bot', '8087844916:AAGFhbRKyjqyMRMQHvfeZHPvass2KXO8Pto', '/sendMessage?text=', 'Hazardous Air Quality! <<Maybe you should: Open the Window to improve the Air Quality>>', '&chat_id=', '-4703309099']])))

if True:
  display.scroll('AIOT')
  mqtt.connect_wifi('ACLAB', 'ACLAB2023')
  mqtt.connect_broker(server='io.adafruit.com', port=1883, username='Anhdo020204', password='aio_BXhj736qyMLQDGfjvL09czjE0G9R')
  display.scroll('READY!')
  time.sleep_ms(1000)
  mqtt.on_receive_message('TELEGRAM', on_mqtt_message_receive_callback__TELEGRAM_)

while True:
  mqtt.check_message()
  time.sleep_ms(1000)
  time.sleep_ms(10)
