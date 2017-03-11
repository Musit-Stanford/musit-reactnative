import React, { Component, } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Image,
  ListView,
  NativeModules,
  TouchableOpacity,
  Linking,
} from 'react-native'
import Contact from './Contact'
import Result from './Result'
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat'
import Swiper from 'react-native-swiper';
import FBSDK, { LoginButton, AccessToken } from 'react-native-fbsdk';
var ScrollableTabView = require('react-native-scrollable-tab-view');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  inActive: {
    color: 'gray'
  },
  directory: {
    flex: 0.2,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: 40,
    backgroundColor: '#F4F4F4',
  },
  directoryText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: 'Avenir',
    marginTop: 80,
    marginLeft: 16,
  },
  userTitle: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Avenir',
    marginTop: 79, 
    marginLeft: 6
  },
  userEntry: {  
    height: 20, 
    width:  200 ,
    fontFamily: 'Avenir',
    fontSize: 14,
    marginTop: 78,
    marginLeft: 6,
    color: 'black'
  },
  knownUsers: {  
    height: 20, 
    width: Dimensions.get('window').width,
    fontFamily: 'Avenir',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 78,
    color: '#0073F9'
  },
  recommendList: {
    position: 'absolute',
    top: -100,
  },
  photo: {
    height: 55,
    width: 55,
    borderRadius: 5,
    position: 'absolute',
    top: 15,
    marginLeft: 40
  },
  listContent: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    justifyContent:'flex-start'
  },
  messageContainer: {
    flex: 1,
  }
});

function getMergedArray(arr1, arr2) {
  var shorterArray;
  var longerArray;
  if (arr1.length > arr2) {
    longerArray = arr1;
    shorterArray = arr2;
  } else {
    longerArray = arr2;
    shorterArray = arr1;
  }
  var shorterArrayLength = shorterArray.length;
  var mergedArray = []
  for (var i = 0; i < shorterArrayLength; i++) {
    mergedArray.push(longerArray[i]);
    mergedArray.push(shorterArray[i]);
  }  
  var longerArrayLength = longerArray.length
  for (var i = shorterArrayLength; i < longerArrayLength; i++) {
    mergedArray.push(longerArray[i])
  }
  return mergedArray.reverse();
}

class Conversation extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var users = [];
    console.log(this.props); 
    this.state = {
      ds: ds,
      allUsers: [],
      messages: [],
      friends: users,
      start: true,
      selectedFriends: [],
      enteringNames: false, 
      message: '', 
      userPhoto: this.props.firebase.auth().currentUser.photoURL,
      guide: props.prepopulatedMessage === undefined ? '  Search Spotify for Track...' : 'Enter a message...',
      editing: false, 
      spotifyResults: ds.cloneWithRows([]),
      soundCloudResults: ds.cloneWithRows([]),
      userSource: ds.cloneWithRows([]),
      recommendation: {}, 
      rec: props.prepopulatedMessage === undefined ? undefined : props.prepopulatedMessage,
      recChosen: props.prepopulatedMessage === undefined ? false : true,
      input: '',
      query: '',
      recepients: [],
      id: this.props.id === undefined ? undefined : this.props.id,
      new: this.props.new === undefined ? false : this.props.new
    };
    this.onSend = this.onSend.bind(this);
    if (this.props.firebase === undefined) return;
    var database = this.props.firebase.database();
    if (this.state.id !== undefined) {
      var conversationId = this.state.id;
      this.subscribeToConversation(conversationId);
    }
    // Get all users in the db
    database.ref("usersData").orderByChild("name").once("value", function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var user = userSnapshot.val()
        user.id = userSnapshot.key;
        users.push(user)
      })
      this.setState({userSource: ds.cloneWithRows(users), allUsers: users});
    }, function(error) {}, this)
  }
  
  componentWillMount() {
    if(!this.props.new) {
      let receipients = [];
      receipients.push({ name: this.props.userName, id: this.props.id }); 
      this.setState({
        recepients: receipients
      });      
    }
    if(this.props.selected) {
      let receipients = [];
      receipients.push({ name: this.props.name, id: this.props.user }); 
      this.setState({
        recepients: receipients
      });
    }
    this.commas(); 
  }
  
  componentDidMount() {
    if(this.refs.recSpace) {
      this.refs.recSpace.focus(); 
    }
  }

  subscribeToConversation(conversationId) {
    var database = this.props.firebase.database();
    database.ref("conversations/" + conversationId + "/messages").on("child_added", (messageKeySnapshot, previousKey) => {
      database.ref("messages/" + messageKeySnapshot.key).once("value", (messageDataSnapshot) => {
        var message = messageDataSnapshot.val();
        message.id = messageDataSnapshot.key;
        this.setState((previousState) => {
          var newMessages = previousState.messages.concat(message);
          return {
            messages: GiftedChat.append(previousState.messages, [message]),
          };
        });
      });
    });
  }

  sendMessage(message) {
    let database = this.props.firebase.database();
    var conversationId = this.state.id;
    var newMessageKey = database.ref().child("messages").push().key;
    message.id = newMessageKey;
    var updates = {};
    var newMessagePath = "/messages/" + message.id + "/";
    var newMessageConversationIndex = "conversations/" + conversationId + "/messages/" + message.id;
    var currentUserId = this.props.firebase.auth().currentUser.uid;
    message.conversationId = conversationId
    message.userId = currentUserId;
    message.userName = this.props.firebase.auth().currentUser.displayName;
    updates[newMessagePath] = message;
    updates[newMessageConversationIndex] = true;
    database.ref().update(updates);
    this.subscribeRecepients(message.id, message.userId);
  }

  subscribeRecepients(messageId, senderId) {
    console.log("here"); 
    var database = this.props.firebase.database();
    var recepients = this.state.recepients; 
    var usersDataPath = "/usersData/";
    var updates = {};
    recepients.forEach(function(user) {
      var recepientUserId = user.id; 
      updates[usersDataPath + recepientUserId + '/messageList/' + messageId] = true;
    });
    updates[usersDataPath + senderId + '/sentList/' + messageId] = true;
    database.ref().update(updates);
  }
  
  onSend(messages = []) {
    console.log(this.state.userPhoto); 
    let message = {
      _id: Math.round(Math.random() * 1000000),
      text: this.state.input,
      createdAt: new Date(),
      user: {
        _id: this.props.firebase.auth().currentUser.uid,
        avatar: this.state.userPhoto
      },
      image: this.state.rec.album.images[0].url,
      track: this.state.rec.name,
      artist: this.state.rec.artists[0].name,
      url: this.state.rec.external_urls.spotify
    }
    let result = []
    result.push(message); 
    let prevMessages = this.state.messages; 
    if(this.state.new) {
      this.createNewConversation(this.state.recepients).then(() => {
        this.sendMessage(message);
        this.setState({
          input: '',
          rec: {},
          recChosen: false,
          start: true,
          messages: GiftedChat.append(prevMessages, result),
          new: false
        })
      }); 
    } else {
      this.sendMessage(message);
      console.log(result); 
      this.setState({
        input: '',
        recChosen: false, 
        rec: {},
        start: true, 
        messages: GiftedChat.append(prevMessages, result),
      })
    }
  }
  
  inputMessage() {
    this.setState({
      recChosen: true,
      editing: false,
    });
  }

 createNewConversation(selectedFriends) {
  var database = this.props.firebase.database();
  var newConversationKey = database.ref().child('conversations').push().key;
  this.setState({
    id: newConversationKey
  });
  this.subscribeToConversation(newConversationKey);
  var updates = {};
  var usersDataPath = "/usersData/";
  var newConversationPath = "/conversations/" + newConversationKey+ "/";
  var currentUserId = this.props.firebase.auth().currentUser.uid;
  return database.ref(usersDataPath + currentUserId).once('value').then(function(snapshot) {
    var username = snapshot.val().name;
    var currentUser = snapshot.val();
    currentUser.id = snapshot.key;
    var users = selectedFriends.concat(currentUser);
    users.forEach(function (user) {
      var userID = user.id
      updates[newConversationPath + "users/" + userID] = true;
      updates[usersDataPath + userID + '/conversations/' + newConversationKey] = true;
    });
    updates[newConversationPath + "updatedTime"] = new Date();
    updates[newConversationPath + "name"] = users.map((user) => user.name).join(", ");
    return database.ref().update(updates);
  });
 }

renderMessageText(props) {
  let color = 'white'
  if(props.currentMessage.user._id != props.user._id) {
    color = 'black'
  }
  return(
    <Text style={{ fontFamily:'Avenir', marginLeft:14, paddingRight: 10, color: color, paddingTop: 5, backgroundColor: 'rgba(0,0,0,0)', minWidth: 150 }}>
      {props.currentMessage.text}
    </Text>
  );
  }
  
  removeRec() {
    this.setState({
      recChosen: false, 
      rec: {}
    });
  }
  
  openTrack(uri) {
    Linking.canOpenURL(uri).then(supported => {
      if (supported) {
        Linking.openURL(uri);
      } else {
        console.log('Don\'t know how to open URI: ' + uri);
      }
    });
  }

  forwardTrack(message) {
    this.props.navigator.push({
          component: Conversation,
          passProps: {new: true, prepopulatedMessage: message, firebase: this.props.firebase},
          backButtonTitle: ' ',
        });
  }
  
  onDonePressList() {
    this.setState({enteringNames: false});
  }
  
  onDonePressSong() {
    this.refs.recSpace.value = ''; 
    this.setState({enteringNames: false, editing: true, recChosen: true});
  }


  
  queryForTracks(query) {
    this.setState({
      editing: true,
      start: false, 
      input: query.text,
    })
    if(query.text.length <= 0) return;

    var SC_URL = 'https://api.soundcloud.com/tracks.json';
    var SC_CLIENT_ID = '1c3aeb3f91390630d351f3c708148086';
    var soundCloudUrl = SC_URL + "?client_id=" + SC_CLIENT_ID + "&q=" + query.text;
    var soundCloudResponse = fetch(soundCloudUrl).then((response) => response.json())

    var url = "https://api.spotify.com/v1/search?q=" + query.text + "&type=track";
    var spotifyResponse = fetch(url).then((response) => response.json())
    var mergedTracks = []
    const placeholderImage = "https://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/032013/soundcloud_logo_0.png?itok=xO8Oaxwr"
    Promise.all([soundCloudResponse, spotifyResponse]).then(values => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1._id !== r2._id});
      // SoundCloud
      var soundCloudTracks = values[0];
      soundCloudTracks.map(function(track){
        track.album = {};
        track.album.images = [{}];
        track.album.images[0].url = track.artwork_url === null ? placeholderImage : track.artwork_url;
        track.name = track.title;
        track.artists = [{}];
        track.artists[0].name = track.user.username;
        track._id = track.id
        track.external_urls = {}
        track.external_urls.spotify = track.permalink_url
      })
      var spotifyTracks = values[1].tracks.items;
      this.setState({
        spotifyResults: ds.cloneWithRows(spotifyTracks),
        soundCloudResults: ds.cloneWithRows(soundCloudTracks)
      })
    })
  }
  
  textColor() {
    if(!this.state.enteringNames) {
      return {
        color: '#0073F9'
      }
    } else {
      return {
        color: 'black'
      }
    }
  }
  
  userTitle() {
    if(this.state.recChosen) {
      return {
        color: 'black',
        fontSize: 14,
        fontWeight: 'normal',
        fontFamily: 'Avenir',
        marginTop: 17,
        marginLeft: 6,
      }
    } else {
      return styles.userTitle; 
    }
  }

  addRecepients(text) {
    var curName = text.substring(text.lastIndexOf(",") + 2).toLowerCase();
    var users = this.state.allUsers;
    var filteredUsers = users.filter(function(el) {
      if(el.id == 'undefined' || el.name == undefined) return false;
      return el.name.toLowerCase().includes(curName); 
    });
    if(text.length == 0) {
      this.setState({text: "", enteringNames: false}); 
    } else {
      this.setState({text, enteringNames: true, userSource: this.state.ds.cloneWithRows(filteredUsers)});
    }
  }

  commas() {
    if(this.props.new) {
      if(this.state.recepients.length >= 1) {
        console.log(this.state.recepients);
        this.refs.names.setNativeProps({text: ''});
        let val = this.state.recepients[0].name + ", ";
        for(let i = 1; i < this.state.recepients.length; i++) {
          val += this.state.recepients[i].name + ", "
        }
        this.refs.names.setNativeProps({text: val});
        if(!this.props.new) {
          this.setState({
            text: val
          });
        }
      }
    }
  }

  renderResult() {
    if(!this.parent.state.recChosen) return (<Text style={{ top: 50 }}>Hello</Text>);
    return(
      <TouchableOpacity
        onPress={() => {this.removeRec()}}
        activeOpacity={75 / 100}>
        <Text style={{color:'white', fontFamily: 'Avenir', fontSize: 14, marginTop: 30, marginLeft: 15}}>X</Text>
        <Image source={{ uri: this.state.rec.album.images[0].url }} style={styles.photo} />
        <View style={{ flexDirection:'column' }}>
          <Text style={{ backgroundColor: 'rgba(0,0,0,0)', fontFamily:'Avenir', color:'white', marginLeft: 85, marginTop: 20, fontSize: 18 }}>{this.state.rec.name}</Text>
          <Text style={{ backgroundColor: 'rgba(0,0,0,0)', fontFamily:'Avenir', color:'white', marginLeft: 85, marginTop: 4, fontSize: 12 }}>{this.state.rec.artists[0].name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  renderComposer(props) {
    let width = Dimensions.get('window').width;
    return(
      <View style={{ flex: 1 }}>
        <TextInput
          style={{
            height: 45,
            width: width,
            fontFamily: 'Avenir',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0)',
            marginLeft: 10,
            color: 'black',
          }}
          ref='recSpace'
          onSubmitEditing={() => {this.parent.onSend()}}
          placeholder={this.parent.state.guide}
          placeholderTextColor={"#95a5a6"}
          onChangeText={(text) => {this.parent.queryForTracks({text})}}
          value={this.parent.state.input}
        />
        {this.parent.state.recChosen ? (
        <TouchableOpacity
          style={{
            height: 45,
            right: 0,
            width: width/2.5,
            marginLeft: 10,
            backgroundColor: 'rgba(0,0,0,0)',
            position: 'absolute',
          }}
          onPress={() => {this.parent.removeRec()}}
          activeOpacity={75 / 100}>
          <Text style={{color:'#0076FF', fontFamily: 'Avenir', fontSize: 14, marginTop: 14, marginLeft:85}}>Remove</Text>
          {this.parent.state.rec ? (
          <Image source={{ uri: this.parent.state.rec.album.images[0].url }} style={{ 
            height: 30,
            width: 30,
            borderRadius: 5,
            position: 'absolute',
            top: 7,
            left: 5,
            marginLeft: 40}} />):(null)}
        </TouchableOpacity>):(null)}
      </View>
    );
  }
  
  renderMessageImage(props) {
    const message = props.currentMessage;
    const url = props.currentMessage.image;
    const artist = props.currentMessage.artist;
    const track = props.currentMessage.track;
    const uri = props.currentMessage.url; 
    let color = 'white'
    if(props.currentMessage.user._id != props.user._id) {
      color = 'black'
    }
    return(
      <TouchableOpacity
        activeOpacity={75 / 100}
        style={{ flexDirection: 'row' }}
        onPress={() => this.parent.openTrack(uri)}>
        <Image 
          style={{
            width: 60,
            height: 60 ,
            borderRadius: 8,
            margin: 10,
          }}  
          resizeMode={"contain"}
          source={{url}}
        />
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              color: color,
              fontSize: 14,
              maxWidth: 200,
              marginRight: 10,
              fontWeight: 'normal',
              fontFamily:  'Avenir' ,
            }}>
            {track}
          </Text>
          <Text
            style={{
              color: color,
              fontSize: 12,
              marginRight: 10,
              fontWeight: 'normal',
              fontFamily: 'Avenir',
            }}>
            {artist}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderPagination(index, total, context) {
    if (index == 0) {
      return (
        <View style={styles.titles}>
          <Text>Spotify <Text style={styles.inActive}>SoundCloud</Text></Text>
        </View>
        )
    } else {
      return (
        <View style={styles.titles}>
          <Text><Text style={styles.inActive}>Spotify</Text> SoundCloud</Text>
        </View>
        )
    }
  }
  
  renderBelow() {
    if(this.parent.state.recChosen || this.parent.state.start) return null; 
    let spotifyData = this.parent.state.spotifyResults;
    let soundCloudData = this.parent.state.soundCloudResults;
    return(
      <ScrollableTabView tabBarActiveTextColor={'#2977B2'} tabBarUnderlineStyle={{backgroundColor:'#2977B2'}} tabBarTextStyle={{fontFamily: 'Avenir'}} tabBarInactiveTextColor={'#bdc3c7'} style={{height: 215}} locked={true} contentProps={{keyboardShouldPersistTaps:"always"}}>
        <View tabLabel="Spotify">
          <ListView
          keyboardShouldPersistTaps="always"
          style={{ backgroundColor: '#FBFBFB' }}
          enableEmptySections={true}
          dataSource={spotifyData}
          renderRow={(data, sectionID, rowID) => <Result {...data} row={rowID} parent={this.parent} navigator={this.parent.props.navigator} onDonePress={() => this.onDonePressSong()}/>}
          scrollEnabled={true}
        />
        </View>
        <View tabLabel="SoundCloud">
          <ListView
            keyboardShouldPersistTaps="always"
            style={{ backgroundColor: '#FBFBFB' }}
            enableEmptySections={true}
            dataSource={soundCloudData}
            renderRow={(data, sectionID, rowID) => <Result {...data} row={rowID} parent={this.parent} navigator={this.parent.props.navigator} onDonePress={() => this.onDonePressSong()}/>}
            scrollEnabled={true}
        />
        </View>
      </ScrollableTabView>      
    );
  }

  render() {
    let data = this.state.userSource;
    let prompt;
    console.log(this.props); 
    if(this.props.selected || !this.state.new) {
      if(this.props.name) {
        prompt = this.props.name; 
        let name = this.props.name; 
        nameOutput = name;
        console.log(name.length);
        if(name.length > 50) {
          name = name.split(",");
          let length = name.length - 1;
          name[0] += " + " + length + " others"; 
          nameOutput = name[0];
        }
      }
    }
    return (
      <View style={styles.container}>
          {(this.props.new && !this.props.selected) ? (
            <View style={styles.directory}>  
              <Text
                style={styles.directoryText}>
                To:           
              </Text> 
              <TextInput
                ref='names'
                multi={false}
                style={[styles.userEntry, this.textColor()]}
                placeholder={ 'Person/Group' }
                placeholderTextColor={"rgba(198,198,204,1)"}
                onFocus={() => {this.commas()}}
                onChangeText={(text) => this.addRecepients(text)}
                onSubmitEditing={() => this.submitText()}
                value={(this.state && this.state.text) || prompt}
              />
            </View>) : (
              <View style={styles.directory}>   
                <Text
                  style={styles.knownUsers}>
                  {nameOutput}         
                </Text>  
              </View> 
            )}
        {this.state.enteringNames ? (
          <ListView
            keyboardShouldPersistTaps="always"
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false}
            dataSource={data}
            renderRow={(data, sectionID, rowID) => <Contact {...data} firebase={this.props.firebase} row={rowID} parent={this} navigator={this.props.navigator}/>}
            scrollEnabled={true}
          />
        ) : (
            <GiftedChat
              keyboardShouldPersistTaps="always"
              parent={this}
              messages={this.state.messages}
              onSend={this.onSend}
              isAnimated={true}
              enableEmptySections={true}
              user={{
                _id: this.props.firebase.auth().currentUser.uid,
              }}
              renderMessageText={this.renderMessageText}
              renderMessageImage={this.renderMessageImage}
              renderComposer={this.renderComposer}
              onInputTextChanged={this.queryForTracks}
              renderFooter={this.renderBelow}
            />
          )}
      </View>
    )
  }
}

export default Conversation