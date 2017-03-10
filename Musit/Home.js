import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ListView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import Row from './Row'
import ThreadRow from './ThreadRow'
import ConversationRow from './ConversationRow'
import SearchBar from 'react-native-search-bar';
import MenuBar from './MenuBar'
import Conversation from "./Conversation";
import Discover from './Discover'

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
    width: 320,
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
        messagesDataSource: ds.cloneWithRows([])
    };
    // this.subscribeToConversations()
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

  subscribeToFriends() {
    var database = this.props.firebase.database();
    let currentUser = this.props.firebase.auth().currentUser;
    var userId = currentUser.uid
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
  
  componentDidMount() {
    this.subscribeToRecommendations();
  }

  componentWillMount() {
    this.subscribeToFriends()
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
        <StatusBar
       />
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
              VIEW ALL
            </Text>
        </View>
        <ScrollView style={{height: 360, marginTop: 10}}>
          <ListView
            pageSize={3}
            enableEmptySections={true}
            dataSource={this.state.messagesDataSource}
            renderRow={(data) => <ConversationRow {...data} firebase={this.props.firebase} navigator={this.props.navigator}/>}
            scrollEnabled={false}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
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
                title: 'Discover Friends',
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
                title: 'New Conversation',
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
                marginLeft: 120,
              }}>
              New Conversation
            </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Home;