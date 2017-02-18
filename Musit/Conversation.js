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
  Linking
} from 'react-native'
import Contact from './Contact'
import Result from './Result'
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat'
import data from './demoData.js'
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
    marginLeft: 20
  },
});

class Conversation extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    var database = this.props.firebase.database();

    var users = [];
    database.ref("usersData").orderByChild("name").once("value", function(snapshot) {
      snapshot.forEach(function(user) {
        users.push(user.val())
      })
      console.log(users)
      this.setState({dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(users)})
    }, function(error) {}, this)

    this.state = {
      ds: ds,
      messages: [],
      friends: users,
      enteringNames: false, 
      dataSource: ds.cloneWithRows(data), 
      message: '', 
      editing: false, 
      spotifyQueries: ds.cloneWithRows([]),
      recommendation: {}, 
      recChosen: false
    };
    this.onSend = this.onSend.bind(this);
  }
  
  componentWillMount() {
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
  
  onSend(messages = []) {
              var url = "https://api.spotify.com/v1/search?q=" + messages[0].text + "&type=artist,track";
              fetch(url)
              .then((response) => response.json())
              .then((responseJson) => {
                console.log(messages)
//                 this.setState({
//                   spotifyQueries: ds.cloneWithRows(responseJson.tracks.items)
//                 })
                messages[0].image = responseJson.tracks.items[0].album.images[0].url
                messages[0].track = responseJson.tracks.items[0].name
                messages[0].artist = responseJson.tracks.items[0].artists[0].name
                messages[0].url = responseJson.tracks.items[0].external_urls.spotify
                    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
              })

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
  
  renderComposer(props) {
    return(
      <TextInput
        style={{
          height: 45, 
          width: Dimensions.get('window').width,
          fontFamily: 'Avenir',
          marginLeft: 10,
        }}
        placeholder={'Enter a recommendation...'}
        placeholderTextColor={"rgba(198,198,204,1)"}
        onChangeText={(text) => {this.parent.querySpotify({text})}}
      />
    );
  }
  
  renderSpotify(props) {
    console.log(this.state.rec);
    return(
      <View>
        {this.state.recChosen ? (
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              backgroundColor: '#4A90E2',
            }}
          >
            <Image source={{ uri: this.state.rec.album.images[0].url }} style={styles.photo} />
            <View style={{ flexDirection:'column' }}>
              <Text style={{ backgroundColor: 'rgba(0,0,0,0)', fontFamily:'Avenir', color:'white', marginLeft: 90, marginTop: 20, fontSize: 18 }}>{this.state.rec.name}</Text>
              <Text style={{ backgroundColor: 'rgba(0,0,0,0)', fontFamily:'Avenir', color:'white', marginLeft: 90, marginTop: 4, fontSize: 12 }}>{this.state.rec.artists[0].name}</Text>
            </View>
          </View>
        ): (
          null
        )}
        <ListView
              style={{ maxHeight: 510, backgroundColor: '#FCFCFC' }}
              automaticallyAdjustContentInsets={false}
              enableEmptySections={true}
              dataSource={this.state.spotifyQueries}
              renderRow={(data, sectionID, rowID) => <Result {...data} row={rowID} parent={this} navigator={this.props.navigator}/>}
              scrollEnabled={true}
            />
        <TextInput
          style={{
            height: 45, 
            width: Dimensions.get('window').width,
            fontFamily: 'Avenir',
            marginLeft: 10,

          }}
          placeholder={'Enter a recommendation...'}
          placeholderTextColor={"rgba(198,198,204,1)"}
          onChangeText={(text) => {this.querySpotify({text})}}
        />
      </View>
    );
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
  
  submitText() {
    console.log("hi"); 
  }
  
  onDonePressList() {
    this.setState({enteringNames: false});
  }
  
  querySpotify(query) {
    console.log(this.state);
    console.log(query.text); 
    this.setState({
      editing: true
    })
    var url = "https://api.spotify.com/v1/search?q=" + query.text + "&type=track";
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
          console.log(responseJson)
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            spotifyQueries: ds.cloneWithRows(responseJson.tracks.items)
          })
      }
    )
  }
  
  textColor() {
    if(!this.state.enteringNames) {
      return 
        color: '#0073F9'
      } else {
      return {
        color: 'black'
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.directory}>
          <Text
            style={styles.directoryText}>
            To:           
          </Text>   
          {!this.props.new ? (
              <Text
               style={styles.userTitle}>
               {this.props.name.first}
              </Text>
            ) : (
              <TextInput
                style={[styles.userEntry, this.textColor()]}
                placeholder={ 'Person / Group' }
                placeholderTextColor={"rgba(198,198,204,1)"}
                onChangeText={(text) => {
                this.setState({text, enteringNames: true})
                var matchingFriends = this.state.friends.filter(function(friend){
                  return friend.name.toLowerCase().startsWith(text.toLowerCase())
                });
                console.log(matchingFriends);
                this.setState({dataSource: this.state.ds.cloneWithRows(matchingFriends)})
              }}
                onSubmitEditing={() => this.submitText()}
                value={(this.state && this.state.text) || ''}
              />
            )}
        </View>
        {this.state.enteringNames ? (
          <ListView
            automaticallyAdjustContentInsets={false}
            dataSource={this.state.dataSource}
            renderRow={(data, sectionID, rowID) => <Contact {...data} row={rowID} navigator={this.props.navigator} onDonePress={() => this.onDonePressList()}/>}
            scrollEnabled={false}
          />
        ) : (!this.state.editing ? (
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
//             renderComposer={this.renderComposer}
//             onInputTextChanged={this.querySpotify}
          />
        ) : (
          this.renderSpotify(this.props)
        ))}
      </View>
    )
  }
}

export default Conversation