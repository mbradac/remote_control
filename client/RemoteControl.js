import React from 'react';
import {
  View,
} from 'react-native';
import { observer } from 'mobx-react/native';
import {
  Card,
  Text,
  LoadingMessage,
} from './Ux';
import Touchpad from './Touchpad';
import { Keyboard } from './Keyboard';

// Expecting props:
//  settingsStore: SettingStore object
//  webSocketStore: WebSocketStore object
@observer
export default class RemoteControl extends React.Component {
  componentWillUnmount() {
    this.props.webSocketStore.disconnect();
  }

  render() {
    this.props.webSocketStore.connect(this.props.settingsStore.uri);
    if (!this.props.webSocketStore.connected) {
      return (
        <LoadingMessage>
          <Text>Connecting to {this.props.settingsStore.uri}...</Text>
          <Text>To change server URI press Settings.</Text>
        </LoadingMessage>
      );
    }
    sendEvent = (event) => {
      console.log('New event: ', event.type, event.data);
      this.props.webSocketStore.send(JSON.stringify(event));
    };
    return (
      <View style={{flex: 1}}>
        <Card>
          <Text>Connected to {this.props.settingsStore.uri}.</Text>
        </Card>
        <Touchpad onEvent={sendEvent}
            sensitivity={this.props.settingsStore.sensitivity}/>
        <Keyboard onEvent={sendEvent}/>
      </View>
    );
  }
}
