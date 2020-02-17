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
@observer
export default class RemoteControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
    };
  }

  connect = () => {
    if (this.state.connected) return;
    try {
      this.socket = new WebSocket(this.props.settingsStore.uri);
    } catch (error) {
      alert('Error creating websocket: ' + error.message);
      console.log('Error creating websocket');
      return;
    }
    this.socket.onopen = () => {
      console.log('Connected to server');
      this.setState({connected: true});
    };
    this.socket.onerror = (event) => {
      console.log('Websocket error')
    };
    this.socket.onclose = () => {
      console.log('Connection closed');
      if (this.state.connected) {
        this.setState({connected: false});
      }
      this.timer = setTimeout(this.connect, 1000);
    }
  }

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    // TODO: Ugh, does this do what I want at all?
    clearTimeout(this.timer);
    this.socket = null;
  }

  render() {
    if (!this.state.connected) {
      return (
        <LoadingMessage>
          <Text>Connecting to {this.props.settingsStore.uri}...</Text>
          <Text>To change server URI press Settings.</Text>
        </LoadingMessage>
      );
    }
    sendEvent = (event) => {
      console.log('New event: ', event.type, event.data);
      this.socket.send(JSON.stringify(event));
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
