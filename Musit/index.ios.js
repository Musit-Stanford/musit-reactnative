import NavigationBar from 'react-native-navbar'
import React, { Component } from 'react';
import {Scene, Router} from 'react-native-router-flux';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Home from './Home'
import realm from './schema.js'

export default class Musit extends Component {
  render() {

    realm.write(() => {
      //realm.create('User', {name: 'this is my name', imgURL: 'this is the imageURL'});
    });

    return (
      <View>
        <NavigationBar
          title={{ title: 'MUSIT', tintColor: "rgba(170,170,170,1)", }}
          rightButton={{ title: '+  ', tintColor: "black" }}
          style={{ backgroundColor: "rgba(251,251,251,1)", }}
          statusBar={{ tintColor: "white", }}
        />
        <Home></Home>
      </View>
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
