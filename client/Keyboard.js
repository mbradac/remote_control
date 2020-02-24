import React from 'react';
import {
  Keyboard,
  TextInput,
  View,
} from 'react-native';
import {
  GreenButton,
  PurpleButton,
  Text,
} from './Ux';

// Expecting props:
//  onEvent: function ({type: string, data: map})
class MyKeyboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showKeyboard: false,
      buttonsPage: 0,
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
    if (!this.state.showKeyboard) {
      return (
        <GreenButton title='Keyboard'
          onPress={() => this.setState({showKeyboard: true})}/>
      );
    }

    // TODO: Maybe we want to minimise keyboard after enter is pressed.
    // Make that configurable.
    // TODO: Handle multiletter events created by swiping whole word over
    // the keyboard.
    // TODO: Add shift, alt, ctrl, delete... buttons.
    // TODO: Show entered text for a while.
    // TODO: Style buttons better.
    // TODO: Fix non ASCII keyboard chars or at list show message to user.
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
    upperRowButtons = (
      <View style={{flexDirection: 'row'}}>
        <PurpleButton title='More'
          onPress={() => this.setState(
            {buttonsPage: (this.state.buttonsPage + 1) % 4})}/>
      </View>
    );
    if (this.state.buttonsPage == 0) {
      buttons = (
        <View>
          {upperRowButtons}
          <View style={{flexDirection: 'row'}}>
            <GreenButton title='Esc'
              onPress={() => this._processEvent({'key': 'Escape'})}/>
            <GreenButton title='Tab'
              onPress={() => this._processEvent({'key': 'Tab'})}/>
            <GreenButton iconName='up'
              onPress={() => this._processEvent({'key': 'Up'})}/>
            <GreenButton iconName='down'
              onPress={() => this._processEvent({'key': 'Down'})}/>
            <GreenButton iconName='left'
              onPress={() => this._processEvent({'key': 'Left'})}/>
            <GreenButton iconName='right'
              onPress={() => this._processEvent({'key': 'Right'})}/>
          </View>
        </View>
      );
    } else if (this.state.buttonsPage == 1) {
      buttons = (
        <View>
          {upperRowButtons}
          <View style={{flexDirection: 'row'}}>
            <GreenButton title='Ins'
              onPress={() => this._processEvent({'key': 'Insert'})}/>
            <GreenButton title='PrntScr'
              onPress={() => this._processEvent({'key': 'PrintScreen'})}/>
            <GreenButton title='Del'
              onPress={() => this._processEvent({'key': 'Delete'})}/>
            <GreenButton title='PgUp'
              onPress={() => this._processEvent({'key': 'PageUp'})}/>
            <GreenButton title='PgDn'
              onPress={() => this._processEvent({'key': 'PageDown'})}/>
            <GreenButton title='Home'
              onPress={() => this._processEvent({'key': 'Home'})}/>
            <GreenButton title='End'
              onPress={() => this._processEvent({'key': 'End'})}/>
          </View>
        </View>
      );
    } else if (this.state.buttonsPage == 2) {
      fButtonNames = new Array(6).fill(undefined).map((_, i) => {
        return 'F' + (i + 1).toString();
      });
      fButtons = fButtonNames.map((name, i) => {
        return (
          <GreenButton title={name} key={i}
            onPress={() => this._processEvent({'key': name})}/>
        );
      });
      buttons = (
        <View>
          {upperRowButtons}
          <View style={{flexDirection: 'row'}}>
            {fButtons}
          </View>
        </View>
      );
    } else {
      fButtonNames = new Array(6).fill(undefined).map((_, i) => {
        return 'F' + (i + 7).toString();
      });
      fButtons = fButtonNames.map((name, i) => {
        return (
          <GreenButton title={name} key={i}
            onPress={() => this._processEvent({'key': name})}/>
        );
      });
      buttons = (
        <View>
          {upperRowButtons}
          <View style={{flexDirection: 'row'}}>
            {fButtons}
          </View>
        </View>
      );
    }

    return (
      <View>
        {buttons}
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
}
export {MyKeyboard as Keyboard};
