import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, ListView, TouchableOpacity, StatusBar } from 'react-native';
import Row from './Row'
import ThreadRow from './ThreadRow'
import ConversationRow from './ConversationRow'
import SearchBar from 'react-native-search-bar';
import MenuBar from './MenuBar'
import Conversation from './Conversation'
import Result from './Result'
import Swiper from 'react-native-swiper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  footer: {
    height: 50,
    position: 'absolute',
    width: 375,
    top: 605,
    marginTop: 12,
    backgroundColor: '#2977B2'
  },
  inActive: {
    color: '#5D9AC8',
    fontSize: 12
  },
  bars: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute', 
    top: 30,
    height: 35,
    backgroundColor: 'rgba(47,122,179,1)',
    width: Dimensions.get('window').width
  },
  top: {
    position: 'absolute', 
    justifyContent: 'center',
    top: 45, 
    height: 30,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(47,122,179,1)',
  },
  category: {
    fontFamily: 'Avenir',
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
  },
  name: {
    fontFamily: 'Avenir',
    color: 'white',
    fontSize: 12,
    textAlign: 'center'
  },
  photo: {
    height: 15,
    width: 15,
    borderRadius: 10,
    marginRight: 8,
  }
});

class Friend extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
        ds: ds,
        messages: [],
        messagesDataSource: ds.cloneWithRows([]),
        sent: ds.cloneWithRows([]),
        received: ds.cloneWithRows([])
    };
  }
  
  componentDidMount() {
    this.subscribeToRecommendations();
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

  componentWillMount() {
  }

  renderPagination(index, total, context) {
    console.log(this.props);
    if (index == 0) {
      return (
        <View style={[styles.top]}>
          <View style={[styles.bars]}>
            <Text style={styles.category}>Sent</Text><Text style={styles.inActive}>Received</Text>
          </View>
        </View>
        )
    } else {
      return (
        <View style={[styles.top]}>
          <View style={[styles.bars]}>
            <Text style={[styles.category, styles.inActive]}>Sent</Text><Text style={styles.category}>Received</Text>
          </View>
        </View>
        )
    }
  }
  
  render() {
    return (
      <View>
        <StatusBar
         barStyle="light-content"
        />
        <Swiper showsButtons={false} renderPagination={(index, total, context) => this.renderPagination(index, total, context)}>
          <ScrollView style={{height: 200, marginTop: 115}}>
            <ListView
              enableEmptySections={true}
              dataSource={this.state.messagesDataSource}
              renderRow={(data) => <ConversationRow {...data} firebase={this.props.firebase} navigator={this.props.navigator}/>}
              scrollEnabled={false}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />
          </ScrollView>
          <ScrollView style={{height: 200, marginTop: 130}}>
            <ListView
              enableEmptySections={true}
              dataSource={this.state.messagesDataSource}
              renderRow={(data) => <ConversationRow {...data} firebase={this.props.firebase} navigator={this.props.navigator}/>}
              scrollEnabled={false}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />
          </ScrollView>
        </Swiper>
        <TouchableOpacity 
          style={styles.footer}
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
                marginLeft: 100,
              }}>
              Send Recommendation
            </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Friend;