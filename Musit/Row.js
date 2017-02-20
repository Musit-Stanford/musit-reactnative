import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import DisplayRecommendation from './DisplayRecommendation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
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
    marginBottom: 10,
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
    marginTop: 1.5,
    marginLeft: 10, 
  }
});

class Row extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const hasRead = this.props.hasRead; 
    let notification = null;
    if(!hasRead) {
      notification = <View style={{ backgroundColor:"#3498db", width:8, height:8, borderRadius: 20, marginTop: 24 }}></View>;
    }
    console.log(this.props); 
    return (
      <TouchableHighlight 
        onPress={() => {this.props.navigator.push({
          component: DisplayRecommendation,
          title: this.props.name.last,
          passProps: {...this.props},
          backButtonTitle: ' '
        })}}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            {notification}
            <View style={styles.textBlock}>
              <Text style={styles.trackName}>
                {`${this.props.name.first}`}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.artistName}>
                  {`${this.props.name.last}`}
                </Text>
                <Text style={styles.donorName}>
                  {`${this.props.name.title}`}
                </Text>
              </View>
            </View>
          </View>
          <Image source={{ uri: this.props.picture.large}} style={styles.photo} />
        </View>
      </TouchableHighlight>
    );
  }
}

export default Row;