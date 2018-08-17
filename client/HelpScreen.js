import React from 'react';
import {
  Card,
  Text,
} from './Ux';

export default class HelpScreen extends React.Component {
  static navigationOptions = {
    title: 'Help',
  }

  render() {
    return (
      <Card>
        <Text>
          Remote Control is used to control your computer via mobile phone.
          Once server part of the app is running on your computer you can use
          your mobile phone as a keyboard and a touchpad to control it.
        </Text>
        <Text>
          After entering an address and a port of the server app and your mobile
          phone is successfully connected new screen will be shown. You can use
          the whole screen in a similar manner you would use touchpad of a
          notebook to control mouse pointer on screen of your computer. Moving
          finger over the screen will move mouse pointer, tapping on the screen
          will be interpreted as the left-click, long-pressing of the screen as
          the right-click and moving two finger up or down would scroll the
          current window.
        </Text>
        <Text>
          On the screen button titled Keyboard will be shown. By pressing it
          keyboard will appear and you can use it to enter text in the same
          way you would using physical keyboard connected the computer
        </Text>
        <Text>
          If you wish to connect to the other computer you can change URI of the
          server in settings menu.
        </Text>
      </Card>
    );
  }
}
