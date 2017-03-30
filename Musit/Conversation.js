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
  NavigatorIOS,
  Alert,
  ActionSheetIOS
} from 'react-native'
import Contact from './Contact'
import Result from './Result'
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat'
import Swiper from 'react-native-swiper';
import FBSDK, { LoginButton, AccessToken } from 'react-native-fbsdk';
var ScrollableTabView = require('react-native-scrollable-tab-view');

const styles = StyleSheet.create({
  container: {
    marginTop: 65,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  inActive: {
    color: 'gray'
  },
  directory: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
  },
  directoryText: {    
    backgroundColor: 'transparent',
    marginTop: 12,
    color: 'black',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Avenir',
    marginLeft: 16,
  },
  userEntry: {  
    width:  200 ,
    fontFamily: 'Avenir',
    fontSize: 14,
    marginLeft: 6,
    color: 'black'
  },
  knownUsers: {  
    marginTop: 12,
    height: 20, 
    width: Dimensions.get('window').width,
    fontFamily: 'Avenir',
    fontSize: 14,
    textAlign: 'center',
    color: '#0073F9'
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
  },
  reactionLabel: {
    textAlign: 'right',
    color: 'white',
    backgroundColor: 'rgba(255,255,255,.1)',
    fontSize: 12,
    marginRight: 10,
    fontWeight: 'normal',
    fontFamily: 'Avenir',
  }, 
  reactionContainer: {}
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

var BUTTONS = [
  'What a classic!',
  "It's lit!",
  'Forward',
  'Cancel',
];
var CLASSIC_INDEX = 0;
var LIT_INDEX = 1;
var FORWARD_INDEX = 2;
var CANCEL_INDEX = 3;

class Conversation extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var users = [];
    this.state = {
      ds: ds,
      allUsers: [],
      giftedChatMessageDataSource: [],
      messages: {},
      friends: users,
      start: true,
      selectedFriends: [],
      enteringNames: false, 
      message: '', 
      userPhoto: this.props.firebase.auth().currentUser.photoURL,
      guide: props.prepopulatedMessage === undefined ? '  Search for a track...' : 'Enter a message...',
      editing: false, 
      spotifyResults: ds.cloneWithRows([]),
      soundCloudResults: ds.cloneWithRows([]),
      YouTubeResults: ds.cloneWithRows([]),
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
      Object.keys(this.props.users).forEach(function(key,index) {
          receipients.push({ id: key });
      });
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
    console.log(NavigatorIOS);
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
        this.state.messages[message.id] = message;
        this.setState((previousState) => {
          return {
            giftedChatMessageDataSource: [message].concat(previousState.giftedChatMessageDataSource),
          };
        })
        database.ref("messages/" + message.id + "/reactions").orderByChild('timestamp').startAt(Date.now()).on("child_added", (reactionDataSnapshot, previousKey) => {
          console.log(message);
          var messageKey = message.id;
          if (message.reactions === undefined) {
            message.reactions = {};
          }
          message.reactions[reactionDataSnapshot.key] = reactionDataSnapshot.val();
          this.setState((previousState) => {
            let newState = []
            for (var i = 0; i < previousState.giftedChatMessageDataSource.length; i++) {
              let message = previousState.giftedChatMessageDataSource[i];
              if (message.id === messageKey) {
                console.log();
                message.reactions[reactionDataSnapshot.key] = reactionDataSnapshot.val();
              }
              newState.push(message)
            }
            return {
              giftedChatMessageDataSource: newState,
            };
          });
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
    if (this.state.rec === undefined || this.state.rec === {}) { // No rec was chosen
      Alert.alert('No song selected', "Don't be shy, they want a recommendation too :)");
      return;
    }
    console.log(this.state.userPhoto); 
    let message = {
      _id: Math.round(Math.random() * 1000000),
      text: this.state.input,
      timestamp: Date.now(),
      createdAt: new Date(),
      user: {
        _id: this.props.firebase.auth().currentUser.uid,
        avatar: this.state.userPhoto
      },
      image: this.state.rec.image,
      track: this.state.rec.track,
      artist: this.state.rec.artist,
      url: this.state.rec.url
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
    this.setState({enteringNames: false, editing: true});
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
    
    var googleAPIKey = 'AIzaSyCpLgHV2G4wcwNN3zkEdQWf9L_3HTJYpnY';
    var youtubeURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + googleAPIKey + '&q=' + query.text;
    var youtubeResponse = fetch(youtubeURL).then((response) => response.json())

    var mergedTracks = []
    const placeholderImage = "https://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/032013/soundcloud_logo_0.png?itok=xO8Oaxwr"

    // What a song needs to look like
    var song = {
      artist: "Chance The Rapper",
      track: "No Problems",
      image: "https://.com",
      url: "https://open.spotify.com" ,
      _id: "Don't know if I actually need this..."
    }

    Promise.all([soundCloudResponse, spotifyResponse, youtubeResponse]).then(values => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1._id !== r2._id});
      // SoundCloud
      var soundCloudTracks = values[0];
      soundCloudTracks.map(function(track){
        track.image = track.artwork_url === null ? placeholderImage : track.artwork_url;
        track.track = track.title;
        track.artist = track.user.username;
        track.url = track.permalink_url;
        track._id = track.id;
      })

      var spotifyTracks = values[1].tracks.items;
      spotifyTracks.map(function(track) {
        track.image = track.album.images[0].url;
        track.track = track.name;
        track.artist = track.artists[0].name;
        track.url = track.external_urls.spotify;
      })
      var youtubeTracks = values[2].items;
      youtubeTracks.map(function(track){
        track.image = track.snippet.thumbnails.default.url;
        track.track = track.snippet.title;
        track.artist = track.snippet.channelTitle;
        track.url = 'https://www.youtube.com/watch?v=' + track.id.videoId;
        track._id = track.id.videoId
      })
      this.setState({
        spotifyResults: ds.cloneWithRows(spotifyTracks),
        soundCloudResults: ds.cloneWithRows(soundCloudTracks),
        YouTubeResults: ds.cloneWithRows(youtubeTracks)
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
        <Image source={{ uri: this.state.rec.image }} style={styles.photo} />
        <View style={{ flexDirection:'column' }}>
          <Text style={{ backgroundColor: 'rgba(0,0,0,0)', fontFamily:'Avenir', color:'white', marginLeft: 85, marginTop: 20, fontSize: 18 }}>{this.state.rec.track}</Text>
          <Text style={{ backgroundColor: 'rgba(0,0,0,0)', fontFamily:'Avenir', color:'white', marginLeft: 85, marginTop: 4, fontSize: 12 }}>{this.state.rec.artist}</Text>
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
            width: (2*width)/3,
            fontFamily: 'Avenir',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0)',
            marginLeft: 10,
            color: 'black',
          }}
          returnKeyType='send'
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
            width: width/3,
            marginLeft: 10,
            backgroundColor: 'rgba(0,0,0,0)',
            position: 'absolute',
          }}
          onPress={() => {this.parent.removeRec()}}
          activeOpacity={75 / 100}>
          <Text style={{color:'#0076FF', fontFamily: 'Avenir', fontSize: 14, marginTop: 14, marginLeft:65}}>Remove</Text>
          {this.parent.state.rec ? (
          <Image source={{ uri: this.parent.state.rec.image }} style={{ 
            height: 30,
            width: 30,
            borderRadius: 5,
            position: 'absolute',
            top: 7,
            left: 5,
            marginLeft: 20}} />):(null)}
        </TouchableOpacity>):(null)}
      </View>
    );
  }

  sendReaction(user, reaction, messageId) {
    let database = this.props.firebase.database();
    let reactionRef = database.ref("/messages/" + messageId + "/reactions");
    reactionRef.push({
      user: user,
      reaction: reaction,
      timestamp: Date.now(),
      createdAt: new Date()
    })
  }

  showActionSheet(message) {
    let user = this.props.firebase.auth().currentUser.displayName;
    let messageId = message.id;
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
    },
    (buttonIndex) => {
      switch(buttonIndex) {
        case LIT_INDEX:
          this.sendReaction(user, BUTTONS[LIT_INDEX], messageId);
          break;
        case CLASSIC_INDEX:
          this.sendReaction(user, BUTTONS[CLASSIC_INDEX], messageId);
          break;
        case FORWARD_INDEX:
          this.forwardTrack(message);
        default:
          break;
      }
    });
  };
  
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
        onPress={() => this.parent.openTrack(uri)}
        onLongPress={() => {this.parent.showActionSheet(props.currentMessage)}}>
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
          <ReactionList reactions={message.reactions}/>
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
    let YouTubeData = this.parent.state.YouTubeResults;
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
        <View tabLabel="YouTube">
          <ListView
            keyboardShouldPersistTaps="always"
            style={{ backgroundColor: '#FBFBFB' }}
            enableEmptySections={true}
            dataSource={YouTubeData}
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
    if(this.props.selected || !this.state.new) {
      if(this.props.name) {
        prompt = this.props.name; 
        let name = this.props.name; 
        nameOutput = name;
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
              <Text style={styles.directoryText}>To:</Text>
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
            </View>
            ) : (
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
              messages={this.state.giftedChatMessageDataSource}
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

class Reaction extends Component {
  render() {
    return (
      <Text style={styles.reactionLabel}>{this.props.user}: {this.props.reaction}</Text>
    );
  }
}

class ReactionList extends Component {
  render() {
    var reactions = [];
    var lastCategory = null;
    if (this.props.reactions === undefined) {
      return null;
    } else {
      Object.keys(this.props.reactions).forEach((reactionKey) => {
        var reaction = this.props.reactions[reactionKey];
        reactions.push(<Reaction user={reaction.user} reaction={reaction.reaction} key={reactionKey} />);
      });
    }
    return (
      <View>
      {reactions}
      </View>
    );
  }
}

export default Conversation