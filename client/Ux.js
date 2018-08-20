import React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  moderateScale as ms,
} from 'react-native-size-matters';

const colors = {
  black: '#000000',
  white: '#FFFFFF',
  near_black: '#1B2138',
  green: '#43BA9E',
}

// TODO: Make these components pure.

// Expecting props:
//  title: string (button text)
//  onPress: function (button press callback)
export class HeaderButton extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}
          hitSlop={{top: ms(5), bottom: ms(5), left: ms(5), right: ms(5)}}>
        <Text style={{color: colors.white,
            fontWeight: 'bold',
            paddingRight: ms(10),
            fontSize: ms(14)}}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

// Expecting props:
//  children
export class Card extends React.Component {
  render() {
    return (
      <View style={{padding: ms(10)}}>
        {this.props.children}
      </View>
    );
  }
}

// Expecting props:
//  children: string (text)
class MyText extends React.Component {
  render() {
    return (
      <Text style={{color: 'black', fontSize: ms(14)}}>
        {this.props.children}
      </Text>
    );
  }
}
export {MyText as Text};

// Expecting props:
//  title: string (button text)
class MyButton extends React.Component {
  render() {
    // TODO: Is using moderateScaling (ms) in elevation property right?
    return (
      <View elevation={ms(2)} style={{padding: ms(7),
          backgroundColor: colors.green,
          borderRadius: ms(5),
          margin: ms(10)}}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={{color: colors.white,
              fontWeight: 'bold',
              fontSize: ms(14),
              textAlign: 'center'}}>
            {this.props.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export {MyButton as Button};

// Expecting props:
//  children
export class LoadingMessage extends React.Component {
  render() {
    // TODO: Flexes used here are a hack. Find better way to do this.
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Card>
          {this.props.children}
        </Card>
        <ActivityIndicator size="large" color={colors.green}/>
      </View>
    );
  }
}

class MyStatusBar extends React.Component {
  render() {
    return <StatusBar backgroundColor={colors.black}/>
  }
}
export {MyStatusBar as StatusBar};

export const navigationStyle = {
  headerStyle: {
    backgroundColor: colors.near_black,
    height: ms(50),
  },
  headerTitleStyle: {
    color: colors.white,
    fontSize: ms(18),
  },
  headerTintColor: colors.white,
}
