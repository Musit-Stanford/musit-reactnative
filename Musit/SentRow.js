import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import DisplayRecommendation from './DisplayRecommendation'
import Conversation from './Conversation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 55,
    width: 55,
    alignItems: 'flex-end',
    borderRadius: 4,
    marginRight: 8,
  },
  textBlock: {
    flexDirection: 'column',
    marginLeft: 12,
  },
  trackName: {
    fontSize: 18,
    letterSpacing: 0.5, 
    width: 250,
    marginBottom: 2,
    fontFamily: 'Avenir',
  },
  artistName: {
    fontSize: 12,
    color: '#8B8B8B',
    fontFamily: 'Avenir',
  },
  donorName: {
    fontSize: 10, 
    fontFamily: 'Avenir',
    color: '#61A7F8',
    marginTop: 10
  }
});

class SentRow extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const hasRead = this.props.hasRead; 
    let notification = null;
    if(!hasRead) {
      notification = <View style={{ backgroundColor:"#3498db", width:8, height:8, borderRadius: 20, marginTop: 31 }}></View>;
    }
    let trackName = this.props.track; 
    console.log(trackName); 
    if(trackName.length >= 30) {
      trackName = trackName.substring(0, 30);
      trackName += "..."; 
    }
    console.log(this.props); 
    return (
      <TouchableHighlight 
        onPress={() => {this.props.navigator.push({
          component: DisplayRecommendation,
          tintColor: '#2977B2',
          title: this.props.userName,
          passProps: {...this.props, id: this.props.conversationId},
          backButtonTitle: ' '
        })}}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.textBlock}>
              <Text style={styles.trackName}>
                {`${trackName}`}
              </Text>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.artistName}>
                  {`${this.props.artist}`}
                </Text>
                <Text style={styles.donorName}>
                  {`${this.props.userName}`}
                </Text>
              </View>
            </View>
          </View>
          <Image source={{ uri: this.props.image}} style={styles.photo} />
        </View>
      </TouchableHighlight>
    );
  }
}

export default SentRow