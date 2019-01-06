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
class MyKeyboard extends React.Component {
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
      // TODO: Add shift, alt, ctrl, delete... buttons.
      // TODO: Show entered text for a while.
      // TODO: Style buttons better.
      // TODO: contextMenuHidden does not appear to work, it is not a big
      // problem since the height of the field is 0 so user shouldn't
      // even be able to see the field.

      // Not all of the keys emit onKeyPress event (on all devices) so
      // onChangeText event is used for tracking all of the key presses
      // except Enter and Backspace. Those are handled by onSubmitEditing and
      // onKeyPress.
      onKeyPress = ({nativeEvent}) => {
        if (nativeEvent.key == 'Backspace') {
          this._processEvent(nativeEvent);
        }
      };
      return (
        <View>
          <View style={{flexDirection: 'row'}}>
            <Button title='Tab'
              onPress={() => this._processEvent({'key': 'Tab'})}/>
            <Button iconName='up'
              onPress={() => this._processEvent({'key': 'Up'})}/>
            <Button iconName='down'
              onPress={() => this._processEvent({'key': 'Down'})}/>
            <Button iconName='left'
              onPress={() => this._processEvent({'key': 'Left'})}/>
            <Button iconName='right'
              onPress={() => this._processEvent({'key': 'Right'})}/>
          </View>
          <TextInput
            style={{height: 0}}
            autoFocus={true}
            onEndEditing={() => this.setState({showKeyboard: false})}
            onSubmitEditing={() => this._processEvent({'key': 'Enter'})}
            onKeyPress={onKeyPress}
            onChangeText={(text) => this._processEvent({'key': text})}
            autoCapitalize='none'
            autoCorrect={false}
            blurOnSubmit={false}
            caretHidden={true}
            contextMenuHidden={true}
            disableFullscreenUI={true}
            keyboardType='visible-password'
            underlineColorAndroid='white'
            value=''/>
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
