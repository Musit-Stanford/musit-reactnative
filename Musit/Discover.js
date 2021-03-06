import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, ListView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import Contact from './Contact' 
import SearchBar from 'react-native-search-bar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  userEntry: {  
    height: 40, 
    width:  Dimensions.width ,
    fontFamily: 'Avenir',
    fontSize: 14,
    marginTop: 78,
    textAlign: 'center',
    backgroundColor: '#ecf0f1',
    color: 'black',
    shadowOffset: {width: 5, height: 5}, 
    shadowOpacity: 0.08, 
    shadowRadius: 4
  }
});

class Discover extends Component {
  constructor(props) {
    super(props);
    var users = [];
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
        ds: ds,
        discover: true,
        allUsers: ds.cloneWithRows([]),
        users: [],
        text: ''
    };
  }
  
  componentDidMount() {
  }

  componentWillMount() {
    // Get all users in the db
    var users = [];
    var database = this.props.firebase.database();  
    database.ref("usersData").orderByChild("name").once("value", function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var user = userSnapshot.val()
        user.id = userSnapshot.key;
        users.push(user)
      });
      this.setState({allUsers: this.state.ds.cloneWithRows(users), users: users});
    }, function(error) {}, this)
  }

  addNames(text) {
    var curName = text.toLowerCase(); 
    var users = this.state.users;
    var filteredUsers = users.filter(function(el) {
      console.log(el)
      if(el.id == 'undefined' || el.name == undefined) return false;
      return el.name.toLowerCase().includes(curName); 
    });
    if(text.length == 0) {
      this.setState({text: ""}); 
    } else {
      this.setState({text, allUsers: this.state.ds.cloneWithRows(filteredUsers)});
    }
  }

  render() {
    let data = this.state.allUsers;
    return (
      <View>
        <TextInput
          ref='names'
          multi={false}
          style={[styles.userEntry]}
          placeholder={ "Search Users" }
          placeholderTextColor={"#7f8c8d"}
          onChangeText={(text) => this.addNames(text)}
          value={(this.state && this.state.text) || ''}
        />
        <ListView
          style={{marginTop: 0, backgroundColor: 'white'}}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          dataSource={data}
          renderRow={(data, sectionID, rowID) => <Contact {...data} firebase={this.props.firebase} parent={this} navigator={this.props.navigator}/>}
          scrollEnabled={true}
            />
      </View>
    );
  }
}

export default Discover;