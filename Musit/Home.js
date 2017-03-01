import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ListView } from 'react-native';
import Row from './Row'
import ThreadRow from './ThreadRow'
import SearchBar from 'react-native-search-bar';
import MenuBar from './MenuBar'

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
        dataSource: ds.cloneWithRows(data),
        threads: [],
        threadDataSource: ds.cloneWithRows([])
    };
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
            threadDataSource: ds.cloneWithRows(newThreads)
          };
        });
      });
    });
  }
  
  componentDidMount() {
  }
  
  render() {
    return (
      <View style={{paddingTop: 60}}>
        <SearchBar
          style={searchStyles.searchContainer}
          ref='searchBar'
          hideBackground={true}
          placeholder='Search Recommendations'
          fontFamily='Avenir'
        />
        <ScrollView style={{ marginTop:50, height: 600}}>
          <View style={{ padding: 10, backgroundColor:'white', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{ 
                color: "rgba(147,147,147,1)",
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "Avenir",
                letterSpacing: 1,
                marginLeft: 10,
              }}>
              RECENT RECOMMENDATIONS
            </Text>
            <MenuBar name='recentRecs' navigator={this.props.navigator}></MenuBar>
          </View>
          <ListView
            pageSize={3}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(data) => <Row {...data} firebase={this.props.firebase} navigator={this.props.navigator}/>}
            scrollEnabled={false}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
          <View style={{ padding: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
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
            <MenuBar name='threads' navigator={this.props.navigator}></MenuBar>
          </View>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.threadDataSource}
            renderRow={(data) => <ThreadRow {...data} firebase={this.props.firebase} new={false} navigator={this.props.navigator} />}
            horizontal={true}
            style={{ marginTop: 10 }}
          />
          <View style={{ padding: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{ 
                color: "rgba(147,147,147,1)",
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "Avenir",
                letterSpacing: 1,
                marginLeft: 10,
              }}>
              MUSIT NETWORK
            </Text>
            <MenuBar name='musitNetwork' navigator={this.props.navigator}></MenuBar>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Home;