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
  Animated
} from 'react-native'
import Home from './Home'
import Conversation from './Conversation'
// import * as firebase from 'firebase';
import FBSDK, { LoginButton, AccessToken } from 'react-native-fbsdk';

// Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyDn-HyzRU2ohuLSUvIbp0D5GZURTrXuxjA",
//   authDomain: "musit-ebe2c.firebaseapp.com",
//   databaseURL: "https://musit-ebe2c.firebaseio.com",
//   storageBucket: "musit-ebe2c.appspot.com",
//   messagingSenderId: "1033927783710"
// };
// firebase.initializeApp(firebaseConfig);
// var provider = new firebase.auth.FacebookAuthProvider();

class Login  extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0),
    };
  }

  _navigateToConversation() {
    this.props.navigator.push({
      component: Conversation,
      title: 'New Recommendation',
      passProps: { new: true }
    });
  }

  componentDidMount() {
    this.state.bounceValue.setValue(1.5);     // Start large
    Animated.spring(                          // Base: spring, decay, timing
      this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 0.9,                         // Animate to smaller size
        friction: 0.8,                          // Bouncier spring
      }
    ).start();                                // Start the animation

    if(AccessToken.getCurrentAccessToken() != null) {
      console.log(this);
      this.props.navigator.replace({
      component: Home, title: 'MUSIT', 
      backButtonTitle: ' ', 
      rightButtonTitle: '+',
      onRightButtonPress: () => this._navigateToConversation(),
    });; 
    }
  }

  render() {
    return (
      <View>
        <View>
          <Animated.Image 
            style={{
              width:  350 ,
              height:  250 ,
              position: 'absolute',
              top: 110,
              left: 20,
              transform: [                        // `transform` is an ordered array
                {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
              ]
            }}
            resizeMode={"contain"}
            source={require('./images/logo.png')}
          />
          <Text
            style={{
              color: '#468EE5',
              backgroundColor: 'rgba(0,0,0,0)',
              fontSize:  42 ,
              position: 'absolute',
              top: 340,
              left: 140,
              fontWeight: 'normal',
              fontFamily: 'Avenir',
            }}>
            musit
          </Text>
        </View>

        <LoginButton
            style={styles.container}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 240, 
    height: 40,
    position: 'absolute',
    top: 490,
    left: 65
  }
});


export default Login;