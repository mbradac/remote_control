import React from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {
  action,
  configure,
  observable,
  runInAction,
} from 'mobx';
import { observer } from 'mobx-react/native';
import HelpScreen from './HelpScreen';
import {
  Card,
  HeaderButton,
  LoadingMessage,
  navigationStyle,
  Picker,
  PickerItem,
  Slider,
  StatusBar,
  Text,
  TextInput,
} from './Ux';
import RemoteControl from './RemoteControl';
import WebSocketStore from './WebSocketStore';

configure({
  enforceActions: 'strict',
});

function isWsUri(str) {
  var pattern = new RegExp('^(wss?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

class SettingsStore {
  @observable isLoaded = false;
  // Never set following variables directly outside of this class. Use setter
  // functions instead.
  @observable uri = '';
  @observable sensitivity = 0.5;
  @observable recentUris = [];

  constructor() {
    AsyncStorage.multiGet(['uri', 'sensitivity', 'recentUris']).then(
        ([[, uri], [, sensitivity], [, recentUris]]) => {
      if (uri !== null) {
        runInAction(() => { this.uri = uri; });
      }
      if (sensitivity !== null) {
        runInAction(() => { this.sensitivity = parseFloat(sensitivity); });
      }
      if (recentUris !== null) {
        runInAction(() => { this.recentUris = JSON.parse(recentUris); });
      }
    }).catch((error) => {
      console.log('Error fetching from storage: ', error);
    });
    runInAction(() => { this.isLoaded = true; });
  }

  updateAsyncStore(key, value) {
    AsyncStorage.setItem(key, value).catch((error) => {
      console.log('Error saving ${key} to storage: ', error);
    });
  }

  @action
  setUri(value) {
    this.uri = value;
    this.updateAsyncStore('uri', value);
    position = this.recentUris.indexOf(value);
    if (position != -1) {
      this.recentUris.splice(position, 1);
    }
    if (this.recentUris.length >= 5) {
      this.recentUris.pop();
    }
    // Since this.recentUris is observable we need to slice it before calling
    // concat.
    this.recentUris = [value].concat(this.recentUris.slice());
    this.updateAsyncStore('recentUris', JSON.stringify(this.recentUris));
  }
  @action
  setSensitivity(value) {
    this.sensitivity = value;
    this.updateAsyncStore('sensitivity', value.toString());
  }
}

@observer
class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  }

  render() {
    settingsStore = this.props.screenProps.settingsStore;
    pickerItemsRecentUris = settingsStore.recentUris.map((s, i) => {
      return <PickerItem label={s} value={s}/>
    });
    return (
      <View>
      <Card>
        <Text>
          Enter server URI in format ws://address:port (e.g. ws://192.168.100.100:5000)
        </Text>
        <TextInput onSubmitEditing={ ({nativeEvent}) => {
          // WebSocket library crashes whole application if URI is not in
          // correct format so this check is done here. This is probably fixed
          // in newer version of react-native library.
          if (isWsUri(nativeEvent.text)) {
            settingsStore.setUri(nativeEvent.text);
          } else {
            alert("Invalid URI");
          }
        }} defaultValue={settingsStore.uri}/>
        <Text>
          Or choose URI from recent ones:
        </Text>
        <Picker
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) =>
              settingsStore.setUri(itemValue)
            }>
          {pickerItemsRecentUris}
        </Picker>
      </Card>
      <Card>
        <Text>
          Touchpad sensitivity
        </Text>
        <Slider onValueChange={(x) => settingsStore.setSensitivity(x)}
          value={settingsStore.sensitivity}/>
      </Card>
    </View>
    );
  }
}

@observer
class MainScreen extends React.Component {
  static navigationOptions({navigation}) {
    return {
      title: 'Remote Control',
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          <HeaderButton
            onPress={() => navigation.navigate('help')}
            title='Help'/>
          <HeaderButton
            onPress={() => navigation.navigate('settings')}
            title='Settings'/>
        </View>
      ),
    }
  }

  render() {
    settingsStore = this.props.screenProps.settingsStore;
    webSocketStore = this.props.screenProps.webSocketStore;
    return (
      <RemoteControl settingsStore={settingsStore}
        webSocketStore={webSocketStore}/>
    );
  }
}

@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.settingsStore = new SettingsStore();
    this.webSocketStore = new WebSocketStore();
  }

  render() {
    if (!this.settingsStore.isLoaded) {
      return (
        <LoadingMessage>
          <Text>
            Loading settings...
          </Text>
        </LoadingMessage>
      );
    } else if (this.settingsStore.settings === {} ||
               !isWsUri(this.settingsStore.uri)) {
      return (
        <SettingsScreen screenProps={{settingsStore: this.settingsStore,
          webSocketStore: this.webSocketStore}}/>
      );
    }
    const NavigationStack = createStackNavigator({
      main: {
        screen: MainScreen,
      },
      settings: {
        screen: SettingsScreen,
      },
      help: {
        screen: HelpScreen,
      },
    }, {
      initialRouteName: 'main',
      navigationOptions: navigationStyle,
    });
    return (
      <View style={{flex: 1}}>
        <StatusBar/>
        <NavigationStack
          screenProps={{settingsStore: this.settingsStore,
            webSocketStore: this.webSocketStore}}/>
      </View>
    );
  }
}
