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
import Orientation from 'react-native-orientation';

// Expecting props:
//  settingsStore: SettingStore object
//  webSocketStore: WebSocketStore object
@observer
export default class RemoteControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: null,
    }
  }

  componentDidMount() {
    this.setState({orientation: Orientation.getInitialOrientation()});
    Orientation.addOrientationListener(this._orientationListener);
  }

  componentWillUnmount() {
    this.props.webSocketStore.disconnect();
    Orientation.removeOrientationListener(this._orientationListener);
  }

  _orientationListener = (orientation) => {
    console.log("promijena");
    console.log(orientation);
    this.setState({orientation: orientation});
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
    if (this.state.orientation == 'LANDSCAPE') {
      text = null;
    } else {
      text = (
        <Card>
          <Text>Connected to {this.props.settingsStore.uri}.</Text>
        </Card>
      );
    }
    return (
      <View style={{flex: 1}}>
        {text}
        <Touchpad onEvent={sendEvent}
            sensitivity={this.props.settingsStore.sensitivity}/>
        <Keyboard onEvent={sendEvent}/>
      </View>
    );
  }
}
