import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Text,
} from 'react-native'
import Friend from './Friend' 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0)',
    justifyContent: 'flex-start',
  },
  photo: {
    height: 45,
    width: 45,
    alignItems: 'flex-end',
    borderRadius: 20,
    marginLeft: 22,
    marginTop: 15,
    shadowColor: "grey", 
    shadowOffset: {width: 5, height: 5}, 
    shadowOpacity: 1, 
    shadowRadius: 5
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

  checkForExistentConversation() {
    var database = this.props.firebase.database();
    database.ref("usersData").orderByChild("name").equalTo(this.props.name).once("value", function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var user = userSnapshot.val()
        console.log(user); 
      })
    }, function(error) {}, this);
  }

  addFriend() {
    let currentUser = this.props.firebase.auth().currentUser; 
    console.log(currentUser); 
    let currId = this.props.firebase.auth().currentUser.uid;
    let database = this.props.firebase.database();
    database.ref("usersData/" + currId + "/friends/").push({
      id: this.props.id,
      name: this.props.name,
      photoURL: this.props.photoURL
    });
    database.ref("usersData/" + this.props.id + "/friends/").push({
      id: currId,
      name: currentUser.displayName,
      photoURL: currentUser.photoURL
    });
    this.props.navigator.pop(); 
  }
  
  pressHandler() {
    if(!this.props.parent.state.discover) {
      Keyboard.dismiss(); 
      let receipients = this.props.parent.state.recepients; 
      this.checkForExistentConversation(this.props); 
      receipients.push({ name: this.props.name, id: this.props.id });
      this.props.parent.setState({
        recepients: receipients,
        enteringNames: false, 
      });
      console.log(receipients); 
      let input = receipients[0].name; 
      if(receipients.length > 1) {
        for(let i = 1; i < receipients.length; i++) {
          input += ", " + receipients[i].name;
        }
      } else {
        input += ", ";
      }
      this.props.parent.refs.names.setNativeProps({text: input, multi: true});
    } else {
      this.props.navigator.push({
        component: Friend,
        barTintColor: '#136CAF',
        tintColor: 'white',
        title: this.props.name,
        titleTextColor: 'white',
        rightButtonTitle: '+',
        onRightButtonPress: () => this.addFriend(),
        passProps: {...this.props},
        firebase: this.props.firebase,
        backButtonTitle: ' ',
      });
    }

  }
  
  render () {
    return (
      <TouchableOpacity 
      style={styles.container}
      onPress={() => this.pressHandler()}
      >
        <Image source={{ uri: this.props.photoURL}} style={styles.photo} />
        <Text style={styles.threadName}>
          {`${this.props.name}`}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default Contact