import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ListView, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, StatusBar } from 'react-native';
import Row from './Row'
import ThreadRow from './ThreadRow'
import ConversationRow from './ConversationRow'
import SearchBar from 'react-native-search-bar';
import MenuBar from './MenuBar'
import Conversation from "./Conversation";
import Discover from './Discover'
import Friend from './Friend.js'

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
    width: Dimensions.get('window').width - 60,
    marginLeft: 30,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CACACA',
  },
  photo: {
    height: 55,
    width: 55,
    alignItems: 'flex-end',
    borderRadius: 4,
    marginRight: 8,
  },
  footer: {
    height: 50,
    width: Dimensions.width,
    marginTop: 12,
    backgroundColor: '#2977B2',
  },
  footerFixed: {
    height: 50,
    width: Dimensions.width,
    marginTop: 95,
    backgroundColor: '#2977B2',
  }
});


const searchStyles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 68,
    paddingTop: 20,
    width: 375,
    height: 40,
    borderBottomColor: '#bbb',
    backgroundColor: 'white',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});


class Home extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
        ds: ds,
        threads: [],
        threadDataSource: ds.cloneWithRows([]),
        allUserSource: ds.cloneWithRows([]),
        messages: [],
        messagesDataSource: ds.cloneWithRows([]),
        usersMap: {"placeholder": "Kek"},
        loadingInitial: false,
        isRefreshing: false
    };
  }

  componentWillMount() {
    this.subscribeToFriends()
    this.allFriends();
    this.getInitialConversations()
  }

  subscribeToConversations() {
    var database = this.props.firebase.database();
    var currentUsersDataPath = "/usersData/" + this.props.firebase.auth().currentUser.uid + "/";
    database.ref(currentUsersDataPath + "conversations/").on("child_added", (conversationKeySnapshot, previousKey) => { // Going to assume names don't change here. Otherwise, I would have to always update these things.
      database.ref("conversations/" + conversationKeySnapshot.key).once("value", (conversationDataSnapshot) => {
        let conversation = conversationDataSnapshot.val();
        conversation.id = conversationDataSnapshot.key;
        this.setState((previousState) => {
          let newThreads = previousState.threads.concat(conversation);
          return {
            threads: newThreads,
            threadDataSource: this.state.ds.cloneWithRows(newThreads)
          };
        });
      });
    });
  }

  getInitialConversations() {
    var database = this.props.firebase.database();
    let currentUserId = this.props.firebase.auth().currentUser.uid;
    var currentUsersDataPath = "/usersData/" + currentUserId + "/";
    let conversations = [];
    database.ref(currentUsersDataPath + "conversations/").once("value")
    .then((conversationKeySnapshot) => { // .val() always returns an object with conversation keys as keys.
      this.setState((previousState) => {
        return {
          loadingInitial: true,
        };
      });
      let allOfMyConversationKeys = Object.keys(conversationKeySnapshot.val());
      let promises = [];
      for (var i = allOfMyConversationKeys.length - 1; i >= 0; i--) {
        let key = allOfMyConversationKeys[i];
        var getConversationData = new Promise((resolve, reject) => {
          database.ref("conversations/" + key).once("value", (conversationDataSnapshot) => {
            let conversation = conversationDataSnapshot.val();
            conversation.id = conversationDataSnapshot.key;
            database.ref("messages/" + Object.keys(conversation.messages).reverse()[0]).once("value").then((messageDataSnapshot) => {
              let message = messageDataSnapshot.val();
              message.id = messageDataSnapshot.key;
              conversation.track = message.track;
              conversation.participant = this.state.usersMap[Object.keys(conversation.users)[0]].name;
              conversation.sender = message.userId === currentUserId ? "You" : this.state.usersMap[message.userId].name;
              conversation.image = message.image
              conversation.recentTime = message.createdAt
              conversations.push(conversation)
              resolve("Success");
            });
          })
        });
        promises.push(getConversationData);
      }
      Promise.all(promises).then((values) => {
        this.setState((previousState) => {
            conversations.sort(function(a, b) {
              console.log(a)
              if (a.recentTime < b.recentTime) {
                return 1
              } else if (a.recentTime > b.recentTime) {
                return -1
              } else {
                return 0
              }
            });
            let newThreads = conversations;
            return {
              threads: newThreads,
              threadDataSource: this.state.ds.cloneWithRows(newThreads),
              loadingInitial: false,
              isRefreshing: false
            };
          });
      })
    });
  }

  subscribeToFriends() {
    var database = this.props.firebase.database();
    let currentUser = this.props.firebase.auth().currentUser;
    var userId = currentUser.uid;
    var users = []
    database.ref("usersData/" + userId + "/friends").on("child_added", function(snapshot, previousKey) {
      users.push(snapshot.val());
      this.setState((previousState) => {
        return {
          allUserSource: this.state.ds.cloneWithRows(users) 
        };
      });
    }, function(error) {}, this);
    database.ref("usersData/" + userId + "/friends").on("child_removed", function(snapshot, previousKey) {
      var filtered = users.filter(function(el) {
        return el.id !== snapshot.val().id;
      })
      this.setState((previousState) => {
        return {
          allUserSource: this.state.ds.cloneWithRows(filtered) 
        };
      });
    }, function(error) {}, this)
  }

  allFriends() {
     var database = this.props.firebase.database();
     var users = []
     database.ref("usersData").orderByChild("name").once("value", (snapshot) => {
       snapshot.forEach((userSnapshot) => {
         var user = userSnapshot.val()
         user.id = userSnapshot.key;
         users.push(user);
         this.state.usersMap[userSnapshot.key] = userSnapshot.val();
       })
       }, function(error) {}, this);
  }



  subscribeToRecommendations() {
    let currentUser = this.props.firebase.auth().currentUser;
    var userId = currentUser.uid
    var database = this.props.firebase.database();
    database.ref("usersData/" + userId + "/messageList").on("child_added", (messageKeySnapshot, previousKey) => {
      database.ref("messages/" + messageKeySnapshot.key).once("value", (messageDataSnapshot) => {
        var message = messageDataSnapshot.val();
        message.id = messageDataSnapshot.key;
        this.setState((previousState) => {
          var newMessages = [message];
          newMessages.push(...previousState.messages.slice(0, 3))
          return {
            messages: newMessages,
            messagesDataSource: this.state.ds.cloneWithRows(newMessages)
          };
        });
      });
    });
  }

  footerStyle() {
    console.log(this.state.allUserSource);
    if(this.state.allUserSource.rowIdentities[0].length == 0) {
      return styles.footerFixed;
    } else {
      return styles.footer;
    }
  }
  
  render() {
    return (
      <View style={{paddingTop: 60}}>
        <View style={{ marginTop: 10, padding: 10, backgroundColor:'#FBFBFB', flexDirection: 'row', justifyContent: 'space-between', shadowColor: "grey", shadowOffset: {width: 5, height: 5}, shadowOpacity: 0.08, shadowRadius: 2}}>
          <Text
            style={{ 
              color: "rgba(147,147,147,1)",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "Avenir",
              letterSpacing: 1,
              marginLeft: 10,
            }}>
            CONVERSATIONS
          </Text>
            <TouchableOpacity 
              onPress={() => {this.props.navigator.push({
                component: Friend,
                barTintColor: '#136CAF',
                tintColor: 'white',
                title: "You",
                titleTextColor: 'white',
                passProps: {...this.props, bar: false, id: this.props.firebase.auth().currentUser.uid},
                firebase: this.props.firebase,
                backButtonTitle: ' ',
              })}}
            >
          <Text
              style={{ 
                color: "rgba(147,147,147,.5)",
                fontSize: 10,
                textDecorationLine: 'underline',
                fontWeight: "bold",
                fontFamily: "Avenir",
                letterSpacing: 1,
                marginLeft: 10,
              }}>
              VIEW PROFILE
            </Text>
            </TouchableOpacity>
        </View>
        <ScrollView 
          style={{height: Dimensions.get('window').height - 305, marginTop: 10}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => this.getInitialConversations()}
              tintColor="#3498db"
              title="Grabbing more tunes..."
              titleColor="#2980b9"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }
        >
          <ListView
            pageSize={3}
            enableEmptySections={true}
            dataSource={this.state.threadDataSource}
            renderRow={(data) => <ConversationRow {...data} firebase={this.props.firebase} navigator={this.props.navigator}/>}
            scrollEnabled={false}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
              <ActivityIndicator
                animating={this.state.loadingInitial}
                style={[styles.centering, {height: 80}]}
                size="large"
              />
        </ScrollView>
          <View style={{ backgroundColor: '#FBFBFB', padding: 10, marginBottom: 5, marginTop: 0, flexDirection: 'row', justifyContent: 'space-between', shadowColor: "grey", shadowOffset: {width: 5, height: 5}, shadowOpacity: 0.1, shadowRadius: 5}}>
            <Text
              style={{ 
                color: "rgba(147,147,147,1)",
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "Avenir",
                letterSpacing: 1,
                marginLeft: 10,
              }}>
              FRIENDS
            </Text>
            <TouchableOpacity 
              onPress={() => {this.props.navigator.push({
                component: Discover,
                passProps: { firebase: this.props.firebase },
                tintColor: '#2977B2',
                titleImage: require('./images/search@3x.png'),
                backButtonTitle: ' '
              })}}
            >
              <Text
                style={{ 
                  color: "rgba(147,147,147,.5)",
                  fontSize: 10,
                  textDecorationLine: 'underline',
                  fontWeight: "bold",
                  fontFamily: "Avenir",
                  letterSpacing: 1,
                  marginLeft: 10,
                }}>
                FIND FRIENDS
              </Text>
            </TouchableOpacity>
          </View>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.allUserSource}
            renderRow={(data) => <ThreadRow {...data} firebase={this.props.firebase} new={false} navigator={this.props.navigator} />}
            horizontal={true}
            style={{marginBottom:5}}
          />
        <TouchableOpacity 
          style={this.footerStyle()}
          onPress={() => {this.props.navigator.push({
                component: Conversation,
                passProps: { new: true, firebase: this.props.firebase },
                tintColor: '#2977B2',
                titleImage: require("./images/recommendation@3x.png"),
                backButtonTitle: ' '
              })}}
          >
          <Text
              style={{ 
                color: "white",
                fontSize: 16,
                letterSpacing: 0.4,
                fontFamily: "Avenir",
                marginTop: 15,
                width: Dimensions.get('window').width,
                textAlign:'center'
              }}>
              New Conversation
            </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Home;