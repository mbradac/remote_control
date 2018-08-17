import React from 'react';
import {
  Dimensions,
  View,
} from 'react-native';
import {
  LongPressGestureHandler,
  PanGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  Card,
  Text,
} from './Ux';

// Expecting props:
//  onEvent: function ({type: string, data: map})
export default class Touchpad extends React.Component {
  _processEvent(type, data) {
    this.props.onEvent({type, data});
  }

  _handleLeftClick = ({nativeEvent}) => {
    if (nativeEvent.state == State.ACTIVE) {
      this._processEvent('LEFT_CLICK', {});
    }
  }

  _handleRightClick = ({nativeEvent}) => {
    if (nativeEvent.state == State.ACTIVE) {
      this._processEvent('RIGHT_CLICK', {});
    }
  }

  _handleMove = ({nativeEvent}) => {
    const {height, width} = Dimensions.get('window');
    const minDimension = Math.min(height, width);
    if (nativeEvent.state == State.ACTIVE) {
      this._processEvent('MOVE', {
        velocityX: nativeEvent.velocityX / minDimension,
        velocityY: nativeEvent.velocityY / minDimension,
      });
    }
  }

  _handleScroll = ({nativeEvent}) => {
    if (nativeEvent.state == State.ACTIVE) {
      this._processEvent('SCROLL', {
        direction: nativeEvent.velocityY < 0 ? 'UP' : 'DOWN',
      });
    }
  }

  render() {
    return (
      // pointer move
      <PanGestureHandler onGestureEvent={this._handleMove}
            minPointers={1} maxPointers={1}>
        {/* scroll */}
        <PanGestureHandler onGestureEvent={this._handleScroll}
              minPointers={2} maxPointers={2}>
          {/* left click */}
          <TapGestureHandler onHandlerStateChange={this._handleLeftClick}>
            {/* right click */}
            {/* TODO: Sometimes scroll is mistaken for right click. */}
            {/* TODO: Add threshold to scroll svents */}
            <LongPressGestureHandler
                onHandlerStateChange={this._handleRightClick}
                minDurationMs={300}>
              <View style={{flex: 1}}>
                <Card>
                  <Text>Use screen as a touchpad.</Text>
                  <Text>If not sure how, press Help for instructions.</Text>
                </Card>
              </View>
            </LongPressGestureHandler>
          </TapGestureHandler>
        </PanGestureHandler>
      </PanGestureHandler>
    );
  }
}
