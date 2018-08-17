import React from 'react';
import {
  AsyncStorage,
  TextInput,
  View,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {
  action,
  configure,
  observable,
} from 'mobx';
import { observer } from 'mobx-react/native';
import HelpScreen from './HelpScreen';
import {
  Card,
  HeaderButton,
  LoadingMessage,
  navigationStyle,
  StatusBar,
  Text,
} from './Ux';
import RemoteControl from './RemoteControl';

configure({
  enforceActions: 'strict',
});

class SettingsStore {
  @observable isUriLoading = false;
  @observable uri = null;

  @action
  loadUri() {
    this.isUriLoading = true;
    AsyncStorage.getItem('uri').then(action((uri) => {
      this.uri = uri;
      this.isUriLoading = false;
    })).catch(action((error) => {
      console.log('Error fetching \'uri\' from storage: ', error);
      this.uri = null;
      this.isUriLoading = false;
    }));
  }

  @action
  saveUri(uri) {
    this.uri = uri;
    this.isUriLoading = false;
    AsyncStorage.setItem('uri', uri).catch((error) => {
      console.log('Error fetching \'uri\' from storage: ', error);
    });
  }
}

@observer
class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  }

  render() {
    settingsStore = this.props.screenProps.settingsStore;
    return (
      <Card>
        <Text>
          Enter uri in format address:port
        </Text>
        <Text>
          eg. 192.168.100.100:5000
        </Text>
        <TextInput onSubmitEditing={ ({nativeEvent}) => {
          settingsStore.saveUri(nativeEvent.text); }}
          defaultValue={settingsStore.uri}/>
      </Card>
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
    return <RemoteControl uri={this.props.screenProps.settingsStore.uri}/>;
  }
}

@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.settingsStore = new SettingsStore();
  }
  componentDidMount() {
    this.settingsStore.loadUri();
  }

  render() {
    if (this.settingsStore.isUriLoading) {
      return (
        <LoadingMessage>
          <Text>
            Loading settings.
          </Text>
        </LoadingMessage>
      );
    } else if (this.settingsStore.uri === null) {
    return <SettingsScreen
      screenProps={{settingsStore: this.settingsStore}}/>
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
          screenProps={{settingsStore: this.settingsStore}}/>
      </View>
      );
  }
}
