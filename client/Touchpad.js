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
//  sensitivity: float
export default class Touchpad extends React.Component {
  constructor(props) {
    super(props);
    this.cumulativeScrollVelocity = 0;
  }

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
        velocityX: this.sensitivity * nativeEvent.velocityX / minDimension,
        velocityY: this.sensitivity * nativeEvent.velocityY / minDimension,
      });
    }
  }

  _handleScrollHandlerStateChange = ({nativeEvent}) => {
    if (nativeEvent.state != State.ACTIVE) {
      this.cumulativeScrollVelocity = 0;
    }
  }

  _handleScroll = ({nativeEvent}) => {
    if (nativeEvent.state == State.ACTIVE) {
      velocity = nativeEvent.velocityY;
      direction =  Math.sign(velocity);
      if (direction != Math.sign(this.cumulativeScrollVelocity)) {
        this.cumulativeScrollVelocity = 0;
      }
      this.cumulativeScrollVelocity += velocity;
      T = 400;
      cntScrolls = Math.floor(Math.abs(this.cumulativeScrollVelocity) / T);
      this.cumulativeScrollVelocity -= direction * cntScrolls * T;
      for (i = 0; i < cntScrolls; ++i) {
        this._processEvent('SCROLL', {
          direction: direction < 0 ? 'UP' : 'DOWN',
        });
      }
    }
  }

  render() {
    // x (this.props.sensitivity) is from 0 to 1.
    // this.sensitivity is exponential function of x that produces values from
    // 0.1 to 10.
    x = this.props.sensitivity;
    b = Math.log(0.1);
    a = Math.log(10) - b;
    this.sensitivity = Math.exp(x * a + b);

    return (
      // pointer move
      <PanGestureHandler onGestureEvent={this._handleMove}
            minPointers={1} maxPointers={1}>
        {/* scroll */}
        <PanGestureHandler onGestureEvent={this._handleScroll}
              onHandlerStateChange={this._handleScrollHandlerStateChange}
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
