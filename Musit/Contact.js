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
    justifyContent: 'flex-start',
  },
  photo: {
    height: 45,
    width: 45,
    alignItems: 'flex-end',
    borderRadius: 20,
    marginLeft: 22,
    marginTop: 15,
  },
  textBlock: {
    flexDirection: 'column',
  },
  threadName: {
    fontSize: 14,
    fontFamily: 'Avenir',
    textAlign: 'left',
    color: '#313131',
    marginTop: 25,
    marginLeft: 10,
  }
});

class Contact extends Component {
  constructor(props) {
    super(props); 
  }
  
  pressHandler() {
    this.props.onDonePress();
  }
  
  render () {
    return (
      <TouchableOpacity 
      style={styles.container}
      onPress={() => this.pressHandler()}
      >
        <Image source={{ uri: this.props.picture.medium}} style={styles.photo} />
        <Text style={styles.threadName}>
          {`${this.props.location.city}`}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default Contact