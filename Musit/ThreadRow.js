import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Conversation from './Conversation'
import Friend from './Friend'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 85,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  photo: {
    height: 50,
    width: 50,
    alignItems: 'flex-end',
    borderRadius: 25,
    marginLeft: 20,
    marginTop: 10
  },
  textBlock: {
    flexDirection: 'column',
    width: 90,
    marginTop: 0
  },
  threadName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#7C7C7C',
    backgroundColor: 'rgba(0,0,0,0)'
  }
});

class ThreadRow extends Component {

  constructor(props) {
    super(props)
  }

  addFriend() {
    let currId = this.props.firebase.auth().currentUser.uid;
    let database = this.props.firebase.database();
    database.ref("usersData/" + currId + "/friends/").push({
      id: this.props.id,
      name: this.props.name,
      photoURL: this.props.photoURL
    });
  }

  render() {
    return(<TouchableOpacity 
      style={styles.container}
      onPress={() => {this.props.navigator.push({
            component: Friend,
            barTintColor: '#136CAF',
            tintColor: 'white',
            title: this.props.name,
            titleTextColor: 'white',
            rightButtonIcon: require('./images/addFriend@2x.png'),
            onRightButtonPress: () => this.addFriend(),
            passProps: {...this.props},
            firebase: this.props.firebase,
            backButtonTitle: ' ',
          })}}
      >
      <Image source={{ uri: this.props.photoURL}} style={styles.photo} />
      <View style={styles.textBlock}>
        <Text style={styles.threadName}>
          {`${this.props.name}`}
        </Text>
      </View>
    </TouchableOpacity>);
  }
}

export default ThreadRow