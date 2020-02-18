import React from 'react';
import {
  ActivityIndicator,
  Button,
  Slider,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  moderateScale,
} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/AntDesign';

const colors = {
  black: '#000000',
  white: '#FFFFFF',
  near_black: '#1B2138',
  green: '#43BA9E',
}

function ms(size) {
  return moderateScale(size, 0.4);
}

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
//  title: string (button text, either title or iconName should be specified)
//  onPress: callback
//  iconName: string (either title or iconName should be specified)
class MyButton extends React.Component {
  render() {
    // TODO: Is using moderateScaling (ms) in elevation property correct?
    const iconName = this.props.iconName;
    const title = this.props.title;
    if ((iconName && title) || (!iconName && !title)) {
      console.warn("Either iconName or title should be specified");
    }
    if (iconName) {
      content = (
        <Icon style={{textAlign: 'center'}}
          name={this.props.iconName} size={20} color={colors.white}/>);
    } else {
      content = (
        <Text style={{color: colors.white,
            fontWeight: 'bold',
            fontSize: ms(14),
            textAlign: 'center'}}>
          {this.props.title}
        </Text>);
    }
    return (
      <TouchableOpacity onPress={this.props.onPress} activeOpacity={0.5}>
        <View elevation={ms(2)} style={{padding: ms(7),
            backgroundColor: colors.green,
            borderRadius: ms(5),
            marginBottom: ms(10),
            marginLeft: ms(10),
            marginRight: ms(10)}}>
          {content}
        </View>
      </TouchableOpacity>
    );
  }
}
export {MyButton as Button};

// Expecting props:
//  same props as official TextInput
class MyTextInput extends React.Component {
  render() {
    return (
      <TextInput {...this.props} style={{fontSize: ms(13)}}
          underlineColorAndroid={colors.green}/>
    );
  }
}
export {MyTextInput as TextInput};

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

// Expected props:
//  same props as official Slider
class MySlider extends React.Component {
  render() {
    return (
      <Slider {...this.props} minimumTrackTintColor={colors.green}
          thumbTintColor={colors.green}/>
    );
  }
}
export {MySlider as Slider};

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
