import Lightbox from "react-native-lightbox";
import NavigationBar from "react-native-navbar";
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  Image,
  Animated
} from "react-native";
import Home from "./Home";
import Conversation from "./Conversation";
import FBSDK, { LoginButton, AccessToken } from "react-native-fbsdk";


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function seedWithUsers(count, database) {
  fetch("https://randomuser.me/api/?results=" + count)
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.results.forEach(function(rando) {
        database.ref("usersData").push({
          name: capitalizeFirstLetter(rando.name.first) + " " + capitalizeFirstLetter(rando.name.last),
          photoURL: rando.picture.thumbnail
        });
      });
    });
}

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
      title: "New Recommendation",
      passProps: { new: true, firebase: this.props.firebase }
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
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        if (data !== null) {
          if (data.accessToken !== undefined) {
            let firebase = this.props.firebase;
            let database = firebase.database();                    
            let credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken.toString());
            firebase.auth().signInWithCredential(credential).then(this.props.onSuccessfulLogin);
          }
        }
      }
    );
  }

  render() {
    return (
      <View>
        <View>
          <Animated.Image 
            style={{
              width:  350 ,
              height:  250 ,
              position: "absolute",
              top: 110,
              left: 20,
              transform: [                        // `transform` is an ordered array
                {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
              ]
            }}
            resizeMode={"contain"}
            source={require("./images/logo.png")}
          />
          <Text
            style={{
              color: "#468EE5",
              backgroundColor: "rgba(0,0,0,0)",
              fontSize:  42 ,
              position: "absolute",
              top: 340,
              left: 140,
              fontWeight: "normal",
              fontFamily: "Avenir",
            }}
          >
            musit
          </Text>
        </View>

        <LoginButton
          style={styles.container}
          publishPermissions={[]}
          emailPermissions={["true"]}
          onLogoutFinished={() => console.log("logout.")}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    let firebase = this.props.firebase;
                    let database = firebase.database();                    
                    let credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken.toString());
                    firebase.auth().signInWithCredential(credential).then(function(user) { 
                      database.ref("usersData").child(user.uid).once("value", function(snapshot) {
                        let exists = (snapshot.val() !== null);
                        if (!exists) {
                          database.ref("usersData/" + user.uid).set({
                            name: user.displayName,
                            photoURL: user.photoURL,
                          });
                          seedWithUsers(50, database);
                        }
                      });
                    }, function(error) {
                      // Handle Errors here.
                      let errorCode = error.code;
                      let errorMessage = error.message;
                      // The email of the user's account used.
                      let email = error.email;
                      // The firebase.auth.AuthCredential type that was used.
                      let credential = error.credential;
                      // ...
                    });
//                     firebase.ref('\')
                  }
                ).then(() => this.props.onSuccessfulLogin());
              }
            }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 240, 
    height: 40,
    position: "absolute",
    top: 490,
    left: 65
  }
});


export default Login;