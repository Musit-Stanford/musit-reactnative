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
import FBSDK, { LoginButton, AccessToken } from 'react-native-fbsdk';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    Icon.getImageSource('user', 20, 'red').then((source) =>
      this.refs.nav.replace({
        component: Home, 
        title: 'Musit', 
        backButtonTitle: ' ',
        rightButtonTitle: ' ',
        titleTextColor: '#1086DE',
        onRightButtonPress: () => this._navigateToConversation(),
        passProps: { firebase: firebase }
      })
    );
    
  }
  
  render() {
    return (
      <NavigatorIOS
        ref='nav'
        initialRoute={{ component: Login, title: 'Musit', backButtonTitle: ' ', rightButtonTitle: ' ', titleTextColor: '#1086DE', passProps: {firebase: firebase, onSuccessfulLogin: () => this._navigateToHome()}}}
        titleTextColor='#E4E4E4'
        shadowHidden={true}
        style={{flex: 1}}
        tintColor='#10ABDE'
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
