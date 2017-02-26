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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
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

class Conversation extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var users = [];

    this.state = {
      ds: ds,
      messages: [],
      friends: users,
      selectedFriends: [],
      enteringNames: false, 
      message: '', 
      guide: '  Search Spotify for Track...',
      editing: false, 
      spotifyQueries: ds.cloneWithRows([]),
      userSource: ds.cloneWithRows([]),
      recommendation: {}, 
      recChosen: false,
      input: '',
      query: '',
      recepients: [],
    };
    this.onSend = this.onSend.bind(this);

    if (this.props.firebase === undefined) return;
    var database = this.props.firebase.database();

    database.ref("usersData").orderByChild("name").once("value", function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var user = userSnapshot.val()
        user.id = userSnapshot.key;
        users.push(user)
      })
      this.setState({userSource: ds.cloneWithRows(users)});
    }, function(error) {}, this)
  }
  
  componentWillMount() {
    console.log(this); 
    if(!this.props.new) {
       this.setState({
        messages: [
          {
            _id: 1,
            text: "This is my bread and butter",
            createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://scontent-sjc2-1.xx.fbcdn.net/v/t31.0-8/13115918_10154011289885259_369530075324702060_o.jpg?oh=1ea9d7e934a89a30dc5cc0e5f4577bde&oe=58FEADFB',
            },
            track: 'Epoch',
            artist: 'Tycho',
            image: 'https://upload.wikimedia.org/wikipedia/en/1/11/Dive_tycho_album.jpg',
            url: 'https://open.spotify.com/track/5EeNRe6Fi29tTrssVzl4dw'
          },
          {
            _id: 2,
            text: "I am in love with Bonobo",
            createdAt: new Date(Date.UTC(2016, 7, 30, 17, 18, 0)),
            user: {
              _id: 1,
              name: 'React Native',
              avatar: 'https://scontent-sjc2-1.xx.fbcdn.net/v/t31.0-8/13115918_10154011289885259_369530075324702060_o.jpg?oh=1ea9d7e934a89a30dc5cc0e5f4577bde&oe=58FEADFB',
            },
            track: 'Cirrus',
            artist: 'Bonobo',
            image: 'https://s-media-cache-ak0.pinimg.com/originals/27/10/2f/27102fbb71756b46f9979b85529ac882.jpg',
            url: 'https://open.spotify.com/track/2lJ4d8MCT6ZlDRHKJ1br14'
          },
        ],
      });
    }
  }
  
  componentDidMount() {
    if(this.refs.recSpace) {
      this.refs.recSpace.focus(); 
    }
  }
  
  onSend(messages = []) {
    let url = "https://api.spotify.com/v1/search?q=" + this.state.recChosen.name + "&type=artist,track";
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      let message = {
        _id: 3,
        text: this.state.input,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://scontent-sjc2-1.xx.fbcdn.net/v/t31.0-8/13115918_10154011289885259_369530075324702060_o.jpg?oh=1ea9d7e934a89a30dc5cc0e5f4577bde&oe=58FEADFB',
        },
        image: this.state.rec.album.images[0].url,
        track: this.state.rec.name,
        artist: this.state.rec.artists[0].name,
        url: this.state.rec.external_urls.spotify
      }
      let result = []
      result.push(message); 
      this.createNewConversation(this.state.recepients); 
      this.setState({
        input: '',
        rec: {},
        recommendation: {},
        messages: GiftedChat.append(this.state.messages, result),
      })
    });
  }
  
  inputMessage() {
    this.setState({
      recChosen: true,
      editing: false,
    });
    console.log(this.refs); 
  }

 createNewConversation(selectedFriends) {
  var database = this.props.firebase.database();
  var newConversationKey = database.ref().child('conversations').push().key;
  var updates = {};
  var usersDataPath = "/usersData/";
  var newConversationPath = "/conversations/" + newConversationKey+ "/";
  var currentUserId = this.props.firebase.auth().currentUser.uid;
  database.ref(usersDataPath + currentUserId).once('value').then(function(snapshot) {
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
    database.ref().update(updates);
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
    console.log(uri); 
    Linking.canOpenURL(uri).then(supported => {
      if (supported) {
        Linking.openURL(uri);
      } else {
        console.log('Don\'t know how to open URI: ' + uri);
      }
    });
  }
  
  onDonePressList() {
    this.setState({enteringNames: false});
  }
  
  onDonePressSong() {
    console.log(this.refs.recSpace);
    this.refs.recSpace.value = ''; 
    this.setState({enteringNames: false, editing: true, recChosen: true});
  }
  
  querySpotify(query) {
    this.setState({
      editing: true,
      input: query.text,
    })
    var url = "https://api.spotify.com/v1/search?q=" + query.text + "&type=track";
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
          console.log(responseJson);
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          let tracks = responseJson.tracks.items.reverse(); 
          this.setState({
            spotifyQueries: ds.cloneWithRows(tracks)
          })
      }
    )
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
    if(text.length == 0) {
      this.setState({text: "", enteringNames: false}); 
    } else {
      this.setState({text, enteringNames: true});
    }
  }

  commas() {
    if(this.state.recepients.length >= 1) {
      let val = this.state.recepients[0].name + ", ";
      for(let i = 1; i < this.state.receipients.length; i++) {
        val += this.state.receipients[i].name + ", "
      }
      this.refs.names.setNativeProps({text: val});
    }
  }

  renderResult() {
    if(!this.parent.state.recChosen) return (<Text style={{ top: 50 }}>Hello</Text>);
    console.log(this.state); 
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
  
  // ScrollView inside a View 
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
            color: '#95a5a6',
          }}
          ref='recSpace'
          onSubmitEditing={() => {this.parent.onSend()}}
          placeholder={this.parent.state.guide}
          placeholderTextColor={"#95a5a6"}
          onChangeText={(text) => {this.parent.querySpotify({text})}}
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
          <Text style={{color:'white', fontFamily: 'Avenir', fontSize: 14, marginTop: 0, marginLeft: 0}}>X</Text>
          {this.parent.state.rec.album ? (
          <Image source={{ uri: this.parent.state.rec.album.images[0].url }} style={{ 
            height: 30,
            width: 30,
            borderRadius: 5,
            position: 'absolute',
            top: 7,
            left: 10,
            marginLeft: 40}} />):(null)}
        </TouchableOpacity>):(null)}
      </View>
    );
  }
  
  renderMessageImage(props) {
    const url = props.currentMessage.image;
    const artist = props.currentMessage.artist;
    const track = props.currentMessage.track;
    const uri = props.currentMessage.url; 
    console.log(uri); 
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
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              color: color,
              fontSize: 14,
              fontWeight: 'normal',
              fontFamily:  'Avenir' ,
            }}>
            {track}
          </Text>
          <Text
            style={{
              color: color,
              fontSize: 12,
              fontWeight: 'normal',
              fontFamily: 'Avenir',
            }}>
            {artist}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  renderBelow() {
    if(this.parent.state.recChosen) return null; 
    let data = this.parent.state.spotifyQueries;
    return(
      <ListView
        style={{ backgroundColor: 'white' }}
        enableEmptySections={true}
        dataSource={data}
        renderRow={(data, sectionID, rowID) => <Result {...data} row={rowID} parent={this.parent} navigator={this.parent.props.navigator} onDonePress={() => this.onDonePressSong()}/>}
        scrollEnabled={true}
    />);
  }
  
  render() {
    let data = this.state.userSource;
    return (
      <View style={styles.container}>
        <View style={styles.directory}>
          <Text
            style={styles.directoryText}>
            To:           
          </Text>   
          {!this.props.new ? (
              <Text
               style={this.userTitle()}>
               {this.props.location.city}
              </Text>
            ) : (
              <TextInput
                ref='names'
                multi={false}
                style={[styles.userEntry, this.textColor()]}
                placeholder={ 'Person / Group' }
                placeholderTextColor={"rgba(198,198,204,1)"}
                onFocus={() => {this.commas()}}
                onChangeText={(text) => this.addRecepients(text)}
                onSubmitEditing={() => this.submitText()}
                value={(this.state && this.state.text) || ''}
              />
            )}
        </View>
        {this.state.enteringNames ? (
          <ListView
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false}
            dataSource={data}
            renderRow={(data, sectionID, rowID) => <Contact {...data} row={rowID} parent={this} navigator={this.props.navigator}/>}
            scrollEnabled={true}
          />
        ) : (
            <GiftedChat
              parent={this}
              messages={this.state.messages}
              onSend={this.onSend}
              isAnimated={true}
              user={{
                _id: 1,
              }}
              renderMessageText={this.renderMessageText}
              renderMessageImage={this.renderMessageImage}
              renderComposer={this.renderComposer}
              onInputTextChanged={this.querySpotify}
              renderFooter={this.renderBelow}
            />
          )}
      </View>
    )
  }
}

export default Conversation