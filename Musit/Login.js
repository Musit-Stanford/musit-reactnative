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
  Animated,
  Dimensions,
  Platform
} from "react-native";
import Home from "./Home";
import Conversation from "./Conversation";
import FBSDK, { LoginButton, AccessToken } from "react-native-fbsdk";
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';



function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

  subscribeToNotifications() {
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
      let firebase = this.props.firebase;
      let database = firebase.database(); 
      let updates = {}
      updates["usersData/" + firebase.auth().currentUser.uid + "/registrationToken"] = token
      database.ref().update(updates);
    });
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
        if(notif.local_notification){
          //this is a local notification
        }
        if(notif.opened_from_tray){
          //app is open/resumed because user clicked banner
        }

        if(Platform.OS ==='ios'){
          //optional
          //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link. 
          //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
          //notif._notificationType is available for iOS platfrom
          switch(notif._notificationType){
            case NotificationType.Remote:
              notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
              break;
            case NotificationType.NotificationResponse:
              notif.finish();
              break;
            case NotificationType.WillPresent:
              notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
              break;
          }
        }
    });
    FCM.on(FCMEvent.RefreshToken, (token) => {
      let firebase = this.props.firebase;
      let database = firebase.database(); 
      let updates = {}
      updates["usersData/" + firebase.auth().currentUser.uid + "/registrationToken"] = token
      database.ref().update(updates);
    });
  }

  componentDidMount() {
    this.state.bounceValue.setValue(1.5);     // Start large
    Animated.spring(                          // Base: spring, decay, timing
      this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 0.9,                         // Animate to smaller size
        friction: 1.2,                          // Bouncier spring
      }
    ).start();                                // Start the animation
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        if (data !== null) {
          if (data.accessToken !== undefined) {
            let firebase = this.props.firebase;
            let database = firebase.database();                    
            let credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken.toString());
            firebase.auth().signInWithCredential(credential).then(() => {
              this.subscribeToNotifications();
              this.props.onSuccessfulLogin();
            });
          }
        }
      }
    );
  }


  render() {
    return (
      <View style={styles.holder}>
        <Animated.Image 
          style={{
            width:  Dimensions.get('window').width/2,
            height:  220 ,
            margin: Dimensions.get('window').width/4,
            transform: [                        // `transform` is an ordered array
              {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
            ]
          }}
          resizeMode={"contain"}
          source={require("./images/logo.png")}
        />

        <LoginButton
        style={{width: (2*Dimensions.get('window').width)/3, height: 40}}
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
                    firebase.auth().signInWithCredential(credential).then((user) => { 
                      database.ref("usersData").child(user.uid).once("value", (snapshot) => {
                        let exists = (snapshot.val() !== null);
                        if (!exists) {
                          database.ref("usersData/" + user.uid).set({
                            name: user.displayName,
                            photoURL: user.photoURL,
                          }).then(() => {
                            this.subscribeToNotifications();
                            this.props.onSuccessfulLogin(); 
                          });
                        } else {
                          this.subscribeToNotifications();
                          this.props.onSuccessfulLogin(); 
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
                  }
                )
              }
            }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.width, 
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  holder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default Login;