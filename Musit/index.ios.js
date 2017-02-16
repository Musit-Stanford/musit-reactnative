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
import Realm from './schema'
import Conversation from './Conversation'

export default class Musit extends Component {
  _handleNavigationRequest() {
    this.refs.nav.push({
      component: Conversation,
      title: 'New Recommendation',
      passProps: { new: true }
    });
  }
  
  render() {
    Realm.write(() => {
//       Realm.create('User', {name: 'this is my name', imgURL: 'this is the imageURL'});
    });

    return (
      <NavigatorIOS
        ref='nav'
        initialRoute={{ component: Home, title: 'Musit', backButtonTitle: ' ', rightButtonTitle: '+', onRightButtonPress: () => this._handleNavigationRequest(), }}
        style={{flex: 1, justifyContent:'center', }}
        titleTextColor='#E4E4E4'
        shadowHidden={true}
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
