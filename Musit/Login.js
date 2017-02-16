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
import * as firebase from 'firebase';
import FBSDK, { LoginButton, AccessToken } from 'react-native-fbsdk';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDn-HyzRU2ohuLSUvIbp0D5GZURTrXuxjA",
  authDomain: "musit-ebe2c.firebaseapp.com",
  databaseURL: "https://musit-ebe2c.firebaseio.com",
  storageBucket: "musit-ebe2c.appspot.com",
  messagingSenderId: "1033927783710"
};
firebase.initializeApp(firebaseConfig);
var provider = new firebase.auth.FacebookAuthProvider();

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
                    // Build Firebase credential with the Facebook access token.
                    var credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken.toString());
                    console.log(credential);
                    // Sign in with credential from the Google user.
                    firebase.auth().signInWithCredential(credential).catch(function(error) {
                      // Handle Errors here.
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      // The email of the user's account used.
                      var email = error.email;
                      // The firebase.auth.AuthCredential type that was used.
                      var credential = error.credential;
                      // ...
                    });
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