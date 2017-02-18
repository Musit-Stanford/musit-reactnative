import Lightbox from 'react-native-lightbox'
import NavigationBar from 'react-native-navbar'
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  Image,
} from 'react-native'
import Home from './Home'
import Conversation from './Conversation'
import FBSDK, { LoginButton, AccessToken } from 'react-native-fbsdk';


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function seedWithUsers(count) {
  fetch('https://randomuser.me/api/?results=' + count)
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.results.forEach(function(rando) {
        database.ref('usersData').push({
        name: capitalizeFirstLetter(rando.name.first) + " " + capitalizeFirstLetter(rando.name.last),
        photoURL: rando.picture.thumbnail
      })
      });
    })
}

class Login  extends Component {
  render() {
    return (
      <View style={styles.container}>
      <View>
        <LoginButton
          publishPermissions={[]}
          emailPermissions={["true"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                this.props.onSuccessfulLogin();
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    var firebase = this.props.firebase;
                    // Initialize Firebase
                    var database = firebase.database();
                    // Build Firebase credential with the Facebook access token.
                    var credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken.toString());
                    // Sign in with credential from the Google user.
                    firebase.auth().signInWithCredential(credential).then(function(user) {
                      database.ref('usersData').child(user.uid).once('value', function(snapshot) {
                      var exists = (snapshot.val() !== null);
                      if (!exists) {
                        database.ref('usersData/' + user.uid).set({
                          name: user.displayName,
                          photoURL: user.photoURL,
                        });
                      }
                    })
                    }, function(error) {
                      // Handle Errors here.
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      // The email of the user's account used.
                      var email = error.email;
                      // The firebase.auth.AuthCredential type that was used.
                      var credential = error.credential;
                      // ...
                    });
//                     firebase.ref('\')
                  }
                )
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}/>
      </View>
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


export default Login;