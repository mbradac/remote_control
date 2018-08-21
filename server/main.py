#!/usr/bin/env python3

import asyncio
import websockets
import json
import logging
import Xlib.XK
from Xlib import X
from Xlib.display import Display
from Xlib.ext import xtest
from argparse import ArgumentParser

display = Display()
logging.basicConfig(level=logging.INFO)

LEFT_CLICK_BUTTON = 1
RIGHT_CLICK_BUTTON = 3
SCROLL_DIRECTION_TO_BUTTON = {
  'UP': 4, 'DOWN': 5
}


def process_message(message):
    parsed_message = json.loads(message)
    event_type = parsed_message['type']
    data = parsed_message['data']
    logging.info('Got ' + event_type + ' event')
    if event_type == 'LEFT_CLICK':
        xtest.fake_input(display, X.ButtonPress, LEFT_CLICK_BUTTON)
        xtest.fake_input(display, X.ButtonRelease, LEFT_CLICK_BUTTON)
        display.sync()
    elif event_type == 'RIGHT_CLICK':
        xtest.fake_input(display, X.ButtonPress, RIGHT_CLICK_BUTTON)
        xtest.fake_input(display, X.ButtonRelease, RIGHT_CLICK_BUTTON)
        display.sync()
    elif event_type == 'MOVE':
        velocity_x = data['velocityX']
        velocity_y = data['velocityY']
        pointer = display.screen().root.query_pointer()
        geometry = display.screen().root.get_geometry()
        min_dimension = min(geometry.width, geometry.height)
        # TODO: Make scale configurable on client.
        # TODO: Maybe linear function is not the best. Exponential could work
        # better.
        scale = 0.05
        new_x = pointer.root_x + int(velocity_x * min_dimension * scale)
        new_y = pointer.root_y + int(velocity_y * min_dimension * scale)
        xtest.fake_input(display, X.MotionNotify, x=new_x, y=new_y)
        display.sync()
    elif event_type == 'SCROLL':
        # TODO: Make it less sesitive.
        button = SCROLL_DIRECTION_TO_BUTTON[data['direction']]
        xtest.fake_input(display, X.ButtonPress, button)
        xtest.fake_input(display, X.ButtonRelease, button)
        display.sync()
    elif event_type == 'KEYBOARD':
        # TODO: Document this.
        key_str = data['key']
        modifier = 0
        if key_str == 'Enter':
            key, modifier = display.keysym_to_keycode(
                    Xlib.XK.string_to_keysym('Return')), 0
        elif key_str == 'Backspace':
            key, modifier = display.keysym_to_keycode(
                    Xlib.XK.string_to_keysym('BackSpace')), 0
        else:
            # key = display.keysym_to_keycode(Xlib.XK.string_to_keysym(key_str))
            keycodes = list(display.keysym_to_keycodes(ord(key_str)))
            if keycodes == []:
                logging.warn('Can not convert `' + key_str + '` to keycode')
                return
            key, modifier = keycodes[0]
        if modifier == 0:
            xtest.fake_input(display, X.KeyPress, key)
            xtest.fake_input(display, X.KeyRelease, key)
        elif modifier == 1:
            shift_l_key = display.keysym_to_keycode(Xlib.XK.XK_Shift_L)
            xtest.fake_input(display, X.KeyPress, shift_l_key)
            xtest.fake_input(display, X.KeyPress, key)
            xtest.fake_input(display, X.KeyRelease, key)
            xtest.fake_input(display, X.KeyRelease, shift_l_key)
        else:
            logging.warn('Unknown modifier', modifier)
            return
        display.sync()
    else:
        raise Exception("Unknown event type")


async def recieve_messages(websocket, path):
    # TODO: Handle exception when device disconnects.
    while True:
        message = await websocket.recv()
        try:
            process_message(message)
        except Exception as e:
            logging.error('Error:', e, '\nprocessing message:', message)


parser = ArgumentParser(description='Remote control server')
parser.add_argument('--port', default=5000, type=int, help='Server port')
parser.add_argument('--address', default='0.0.0.0', help='Server address')
args = parser.parse_args()

start_server = websockets.serve(recieve_messages, args.address, args.port)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
