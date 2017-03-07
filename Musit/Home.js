import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ListView, TouchableOpacity } from 'react-native';
import Row from './Row'
import ThreadRow from './ThreadRow'
import ConversationRow from './ConversationRow'
import SearchBar from 'react-native-search-bar';
import MenuBar from './MenuBar'
import Conversation from "./Conversation";

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
    width: 375,
    marginTop: 10,
    backgroundColor: '#10ABDF'

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
    var users = []
    database.ref("usersData").orderByChild("name").once("value", function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var user = userSnapshot.val()
        user.id = userSnapshot.key;
        users.push(user)
      })
      this.setState((previousState) => {
        return {
          allUserSource: this.state.ds.cloneWithRows(users) 
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
  
  render() {
    return (
      <View style={{paddingTop: 60}}>
        <SearchBar
          style={searchStyles.searchContainer}
          ref='searchBar'
          hideBackground={true}
          placeholder='Search Friends'
          fontFamily='Avenir'
        />
        <View style={{ marginTop: 50, padding: 10, backgroundColor:'#FBFBFB', flexDirection: 'row', justifyContent: 'space-between' }}>
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
          <MenuBar name='recentRecs' navigator={this.props.navigator}></MenuBar>
        </View>
        <ScrollView style={{height: 330}}>
          <ListView
            pageSize={3}
            enableEmptySections={true}
            dataSource={this.state.messagesDataSource}
            renderRow={(data) => <ConversationRow {...data} firebase={this.props.firebase} navigator={this.props.navigator}/>}
            scrollEnabled={false}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
        </ScrollView>
          <View style={{ backgroundColor: '#FBFBFB', padding: 10, marginBottom: 5, marginTop: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
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
            <MenuBar name='threads' navigator={this.props.navigator}></MenuBar>
          </View>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.allUserSource}
            renderRow={(data) => <ThreadRow {...data} firebase={this.props.firebase} new={false} navigator={this.props.navigator} />}
            horizontal={true}
            style={{marginBottom:5}}
          />
        <TouchableOpacity 
          style={styles.footer}
          onPress={() => {this.props.navigator.push({
                component: Conversation,
                passProps: { new: true, firebase: this.props.firebase },
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