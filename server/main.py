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
    logging.info('Got ' + event_type + ' event ({})'.format(data))
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
        scale = 0.05
        new_x = pointer.root_x + int(velocity_x * min_dimension * scale)
        new_y = pointer.root_y + int(velocity_y * min_dimension * scale)
        xtest.fake_input(display, X.MotionNotify, x=new_x, y=new_y)
        display.sync()
    elif event_type == 'SCROLL':
        button = SCROLL_DIRECTION_TO_BUTTON[data['direction']]
        xtest.fake_input(display, X.ButtonPress, button)
        xtest.fake_input(display, X.ButtonRelease, button)
        display.sync()
    elif event_type == 'KEYBOARD':
        # TODO: Document this.
        key_str = data['key']
        modifier = 0
        SPECIAL_CHARS_MAP = {
            'Enter': 'Return',
            'Backspace': 'BackSpace',
            'Escape': 'Escape',
            'Tab': 'Tab',
            'Up': 'Up',
            'Down': 'Down',
            'Left': 'Left',
            'Right': 'Right',
            'Insert': 'Insert',
            'PrintScreen': 'Print',
            'Delete': 'Delete',
            'PageUp': 'Page_Up',
            'PageDown': 'Page_Down',
            'Home': 'Home',
            'End': 'End',
            'F1': 'F1',
            'F2': 'F2',
            'F3': 'F3',
            'F4': 'F4',
            'F5': 'F5',
            'F6': 'F6',
            'F7': 'F7',
            'F8': 'F8',
            'F9': 'F9',
            'F10': 'F10',
            'F11': 'F11',
            'F12': 'F12',
        }
        if key_str in SPECIAL_CHARS_MAP:
            key, modifier = display.keysym_to_keycode(
                    Xlib.XK.string_to_keysym(SPECIAL_CHARS_MAP[key_str])), 0
        else:
            # key = display.keysym_to_keycode(Xlib.XK.string_to_keysym(key_str))
            keycodes = list(display.keysym_to_keycodes(ord(key_str)))
            if keycodes == []:
                logging.warn('Can not convert `' + key_str + '` to keycode')
                return
            key, modifier = keycodes[0]
        if modifier != 0 and modifier != 1:
            logging.warn('Unknown modifier', modifier)
            return
        modifiers = [
                (modifier, Xlib.XK.XK_Shift_L),
                (data['ctrl'], Xlib.XK.XK_Control_L),
                (data['alt'], Xlib.XK.XK_Alt_L),
                (data['altGr'], Xlib.XK.XK_Alt_R),
                (data['super'], Xlib.XK.XK_Super_L),
        ];
        # TODO: alt + tab does not seem to work as expected
        for flag, keysym in modifiers:
            if flag:
                keycode = display.keysym_to_keycode(keysym)
                xtest.fake_input(display, X.KeyPress, keycode)
        xtest.fake_input(display, X.KeyPress, key)
        xtest.fake_input(display, X.KeyRelease, key)
        for flag, keysym in reversed(modifiers):
            if flag:
                keycode = display.keysym_to_keycode(keysym)
                xtest.fake_input(display, X.KeyRelease, keycode)
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

logging.info('Listening on {}:{}'.format(args.port, args.address))
start_server = websockets.serve(recieve_messages, args.address, args.port)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
