import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  photo: {
    height: 35,
    width: 35,
    alignItems: 'flex-end',
    borderRadius: 5,
    marginLeft: 22,
  },
  textBlock: {
    flexDirection: 'column',
  },
  trackName: {
    fontSize: 14,
    fontFamily: 'Avenir',
    textAlign: 'left',
    color: '#8B8B8B',
    marginLeft: 10,
  }, artistName: {
    fontSize: 10,
    fontFamily: 'Avenir',
    textAlign: 'left',
    color: '#66A9F7',
    marginLeft: 10,
  }
});

class Result extends Component {
  constructor(props) {
    super(props); 
  }
  
  pressHandler() {
    this.props.parent.setState({
      rec: this.props,
      recChosen: true,
      guide: 'Enter a message...',
      input:'',
    });
  }
  
  render () {
    return (
      <TouchableOpacity 
      style={styles.container}
      onPress={() => this.pressHandler()}
      >
        <Image source={{ uri: this.props.album.images[0].url }} style={styles.photo} />
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.trackName}>
            {`${this.props.name}`}
          </Text>
          <Text style={styles.artistName}>
            {`${this.props.artists[0].name}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Result