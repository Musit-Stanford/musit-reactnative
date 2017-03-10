import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ListView, TouchableOpacity, StatusBar } from 'react-native';
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
});

class Profile extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
        ds: ds,
    };
  }
  
  componentDidMount() {
  }

  componentWillMount() {
  }
  
  render() {
    return (
      <View>
        <StatusBar
         barStyle="light-content"
       />
      </View>
    );
  }
}

export default Profile;