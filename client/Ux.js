import React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
      <TouchableOpacity onPress={this.props.onPress}>
        <Text style={{color: colors.white,
            fontWeight: 'bold', paddingRight: 10}}>
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
      <View style={{padding: 10}}>
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
      <Text style={{color: 'black'}}>
        {this.props.children}
      </Text>
    );
  }
}
export {MyText as Text};

class MyButton extends React.Component {
  render() {
    return (
      <View style={{padding: 10}}>
        <Button color={colors.green} {...this.props}/>
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
  },
  headerTitleStyle: {
    color: colors.white,
  },
  headerTintColor: colors.white,
}
