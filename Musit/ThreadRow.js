import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Conversation from './Conversation'
import Friend from './Friend'
const add = require('./images/addFriend@2x.png');
const remove = require('./images/removeFriend.png')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 80,
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
    marginTop: 10,
    fontSize: 10,
    width: 100,
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

  unFriend() {
    let currId = this.props.firebase.auth().currentUser.uid;
    let database = this.props.firebase.database();
    let friendId = this.props.id; 
    database.ref("usersData/" + currId + "/friends/").orderByChild("id").equalTo(this.props.id).once("value", function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var user = userSnapshot.val()
        database.ref("usersData/" + currId + "/friends/" + userSnapshot.key).remove(); 
      })
    });
    database.ref("usersData/" + this.props.id + "/friends/").orderByChild("id").equalTo(currId).once("value", function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var user = userSnapshot.val();
        database.ref("usersData/" + friendId + "/friends/" + userSnapshot.key).remove(); 
      })
    });
    this.props.navigator.pop(); 
  }

  render() {
    let name = this.props.name; 
    let names = name.split(" "); 
    let lastInitial = names[1].substring(0,1); 
    let final = names[0] + ' ' + lastInitial; 
    return(<TouchableOpacity 
      style={styles.container}
      onPress={() => {this.props.navigator.push({
            component: Friend,
            barTintColor: '#136CAF',
            tintColor: 'white',
            title: this.props.name,
            titleTextColor: 'white',
            rightButtonTitle: 'X',
            onRightButtonPress: () => this.unFriend(),
            passProps: {...this.props},
            firebase: this.props.firebase,
            backButtonTitle: ' ',
          })}}
      >
      <Image source={{ uri: this.props.photoURL}} style={styles.photo} />
      <View style={styles.textBlock}>
        <Text style={styles.threadName}>
          {final}
        </Text>
      </View>
    </TouchableOpacity>);
  }
}

export default ThreadRow