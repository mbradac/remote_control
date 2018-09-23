import React from 'react';
import {
  Keyboard,
  TextInput,
  View,
} from 'react-native';
import {
  Button,
  Text,
} from './Ux';

// Expecting props:
//  onEvent: function ({type: string, data: map})
export class MyKeyboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showKeyboard: false,
    }
  }

  componentDidMount() {
    this.keyboardDidHideListener =
      Keyboard.addListener('keyboardDidHide',
      () => this.setState({showKeyboard: false}));
  }

  componentWillUnmount () {
    this.keyboardDidHideListener.remove();
  }

  _processEvent(data) {
    type = 'KEYBOARD';
    this.props.onEvent({type, data});
  }

  render() {
    if (this.state.showKeyboard) {
      // TODO: Maybe we want to minimise keyboard after enter is pressed.
      // Make that configurable.
      // TODO: Handle multiletter events created by swiping whole word over
      // the keyboard.
      // TODO: Clear textinput so that it doesn't store too much chars.
      // TODO: Add shift, alt, ctrl, delete... buttons.
      // TODO: Show entered text for a while.
      return (
        <View>
          <Button title='Tab'
            onPress={() => this._processEvent({'key': 'Tab'})}/>
          <TextInput
            style={{height: 0}}
            underlineColorAndroid='white'
            autoFocus={true}
            onEndEditing={() => this.setState({showKeyboard: false})}
            onSubmitEditing={() => this._processEvent({'key': 'Enter'})}
            onKeyPress={({nativeEvent}) => this._processEvent(nativeEvent)}
            autoCapitalize='none'
            autoCorrect={false}
            caretHidden={true}
            blurOnSubmit={false}/>
        </View>
      );
    }
    return (
      <Button title='Keyboard'
        onPress={() => this.setState({showKeyboard: true})}/>
    );
  }
}
export {MyKeyboard as Keyboard};
