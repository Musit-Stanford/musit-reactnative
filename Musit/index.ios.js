import Lightbox from 'react-native-lightbox'
import NavigationBar from 'react-native-navbar'
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  Image,
} from 'react-native'
import Home from './Home'
import Login from './Login'
import Conversation from './Conversation'
import * as firebase from 'firebase';
import FBSDK, { LoginButton, AccessToken } from 'react-native-fbsdk';

export default class Musit extends React.Component {
  _navigateToConversation() {
    this.refs.nav.push({
      component: Conversation,
      title: 'New Recommendation',
      passProps: { new: true }
    });
  }
  _navigateToHome() {
    this.refs.nav.replace({
      component: Home, title: 'MUSIT', 
      backButtonTitle: ' ', 
      rightButtonTitle: '+',
      onRightButtonPress: () => this._navigateToConversation(),
    });
  }
  
  render() {

    return (
      <NavigatorIOS
        ref='nav'
        initialRoute={{ component: Login, title: 'MUSIT', backButtonTitle: ' ', rightButtonTitle: ' ', passProps: {onSuccessfulLogin: () => this._navigateToHome()}}}
        titleTextColor='#E4E4E4'
        shadowHidden={true}
        style={{flex: 1}}
        tintColor='#DCDCDC'
        barTintColor='white'
        interactivePopGestureEnabled={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  }
});

AppRegistry.registerComponent('Musit', () => Musit);
