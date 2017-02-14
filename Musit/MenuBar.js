import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native'
import Threads from './Threads'

const styles = StyleSheet.create({
  menuButton: {
    backgroundColor:"#ecf0f1", 
    width:6, 
    height:6, 
    borderRadius: 20, 
    marginTop: 5,
    marginLeft: 3
  }
});

class MenuBar extends Component {
  constructor(props) {
    super(props);
  }
  
  goToMenu() {
    if(this.props.name == 'threads') {
      this.props.navigator.push({
        component: Threads,
        title: '💬',
        backButtonTitle: ' '
      })
    } 
  }
  
  render() {
    return (
      <TouchableOpacity
        onPress={() => {this.goToMenu()}}
        activeOpacity={ 100  / 100}
        underlayColor={"rgb(210,210,210)"}
        style={{marginRight: 15}}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.menuButton}></View>
          <View style={styles.menuButton}></View>
          <View style={styles.menuButton}></View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default MenuBar; 