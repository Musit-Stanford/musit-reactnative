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
import Profile from './Profile'
import Conversation from './Conversation'
import FBSDK, { LoginButton, AccessToken } from 'react-native-fbsdk';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDn-HyzRU2ohuLSUvIbp0D5GZURTrXuxjA",
  authDomain: "musit-ebe2c.firebaseapp.com",
  databaseURL: "https://musit-ebe2c.firebaseio.com",
  storageBucket: "musit-ebe2c.appspot.com",
  messagingSenderId: "1033927783710"
};
firebase.initializeApp(firebaseConfig);

export default class Musit extends React.Component {
  
  _navigateToConversation() {
    this.refs.nav.push({
      component: Conversation,
      title: 'New Recommendation',
      passProps: { new: true, firebase: firebase }
    });
  }

  _navigateToHome() {
    this.refs.nav.replace({
      component: Home, 
      titleImage: require('./images/musit.png'),
      backButtonTitle: ' ',
      rightButtonTitle: ' ',
      titleTextColor: '#2977B2',
      tintColor: 'rgba(0,0,0,0)',
      onLeftButtonPress: () => this._navigateToProfile(),
      passProps: { firebase: firebase }
    }); 
  }

  render() {
    return (
      <NavigatorIOS
        ref='nav'
        initialRoute={{ component: Login, title: "", titleImage: require('./images/musit.png'), tintColor: '#2977B2', backButtonTitle: ' ', titleTextColor: '#2977B2', passProps: {firebase: firebase, onSuccessfulLogin: () => this._navigateToHome()}}}
        titleTextColor='#2977B2'
        shadowHidden={true}
        style={{flex: 1}}
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
