import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import Conversation from './Conversation'
import SocialChip from './SocialChip'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  textBlock: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  trackName: {
    fontSize: 10,
    color: '#C0C0C0',
    letterSpacing: 0.5, 
    marginBottom: 4,
    fontFamily: 'Avenir',
  }
});

class ThreadConvo extends Component {
  constructor(props) {
    super(props);
  }
  
  photoStyle() {
    if(!this.props.hasRead) {
      return {
        height: 45,
        width: 45,
        borderRadius: 22
      }
    } else {
      return {
        height: 45,
        width: 45,
        borderRadius: 22,
        marginLeft: 20
      }
    }
  }
  
  groupName() {
    if(!this.props.hasRead) {
      return {
        fontSize: 12,
        marginBottom: 0,
        fontFamily: 'Avenir',
      }
    } else {
      return {
        fontSize: 12,
        marginBottom: 4,
        fontFamily: 'Avenir',
      }
    }
  }
  
  render() {
    const hasRead = this.props.hasRead; 
    let notification = null;
    if(!hasRead) {
      notification = <View style={{ backgroundColor:"#18B13E", width:8, height:8, borderRadius: 20, marginTop: 18, marginRight: 12 }}></View>;
    }
    return (
      <TouchableHighlight 
        onPress={() => {this.props.navigator.push({
          component: Conversation,
          title: this.props.name.first,
          passProps: {...this.props},
          backButtonTitle: ' ',
        })}}
        >
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', marginTop: 4, }}>
            {notification}
            <Image source={{ uri: this.props.picture.medium}} style={this.photoStyle()} />
            <View style={styles.textBlock}>
              {hasRead ? (
                <Text style={styles.trackName}>
                  Owner: {`${this.props.name.title}`}
                </Text>
              ) : (
                <Text></Text>
              )}
              <View style={{ flexDirection: 'row' }}>
                <Text style={this.groupName()}>
                  {`${this.props.name.first}`}
                </Text>
              </View>
            </View>
          </View>
          <SocialChip {...this.props}></SocialChip>
        </View>
      </TouchableHighlight>
    );
  }
}

export default ThreadConvo