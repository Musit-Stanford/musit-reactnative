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
    marginLeft: 40
  },
  listContent: {
    flex: 0.2,
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    justifyContent:'flex-start'
  },
});

class Conversation extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      messages: [], 
      enteringNames: false, 
      dataSource: ds.cloneWithRows(data), 
      message: '', 
      editing: false, 
      spotifyQueries: ds.cloneWithRows([]), 
      recommendation: {}, 
      recChosen: false,
      input: '',
      recepients: {},
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
  
  componentDidMount() {
    if(this.refs.trackName) {
      this.refs.trackName.focus(); 
    }
  }
  
  onSend(messages = []) {
    let url = "https://api.spotify.com/v1/search?q=" + messages[0].text + "&type=artist,track";
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(messages)
      this.setState({
        spotifyQueries: ds.cloneWithRows(responseJson.tracks.items)
      })
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
  
  inputMessage() {
    this.setState({
      recChosen: true,
      editing: false,
    });
    console.log(this.refs); 
    this.refs.trackName.setNativeProps({text: '', placeholder: 'Enter a message...'});
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
  
  removeRec() {
    this.setState({
      recChosen: false, 
      rec: {}
    });
  }
  
  listStyle() {
    if(this.state.recChosen) {
      return {
        position: 'absolute',
        top: 62,
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        height: 50,
        backgroundColor: '#F4F4F4',
      }
    } else {
      return styles.directory;
    }
  }
  
  listTrick() {
    if(this.state.recChosen) {
      return {
        position: 'absolute',
        top: 110,
        height: 85,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        backgroundColor: '#4A90E2',
        justifyContent:'flex-start'
      }
    } else {
      return styles.listContent; 
    }
  }
  
  renderSpotify(props) {
    return(
      <View>
        {this.state.recChosen ? (
          <View
            style={this.listTrick()}
          >
            <TouchableOpacity
              onPress={() => {this.removeRec()}}
              activeOpacity={75 / 100}>
              <Text style={{color:'white', fontFamily: 'Avenir', fontSize: 14, marginTop: 30, marginLeft: 15}}>X</Text>
            </TouchableOpacity>
            <Image source={{ uri: this.state.rec.album.images[0].url }} style={styles.photo} />
            <View style={{ flexDirection:'column' }}>
              <Text style={{ backgroundColor: 'rgba(0,0,0,0)', fontFamily:'Avenir', color:'white', marginLeft: 85, marginTop: 20, fontSize: 18 }}>{this.state.rec.name}</Text>
              <Text style={{ backgroundColor: 'rgba(0,0,0,0)', fontFamily:'Avenir', color:'white', marginLeft: 85, marginTop: 4, fontSize: 12 }}>{this.state.rec.artists[0].name}</Text>
            </View>
          </View>
        ): (
          null
        )}
        {this.state.recChosen ? (
          null
        ) : (
          <ListView
              style={{ maxHeight: 510, backgroundColor: '#FCFCFC' }}
              automaticallyAdjustContentInsets={false}
              enableEmptySections={true}
              dataSource={this.state.spotifyQueries}
              renderRow={(data, sectionID, rowID) => <Result {...data} row={rowID} parent={this} navigator={this.props.navigator} onDonePress={() => this.onDonePressSong()}/>}
              scrollEnabled={true}
            />
        )}
        <TextInput
          ref='trackName'
          autoFocus={true}
          style={{
            height: 45, 
            width: Dimensions.get('window').width,
            fontFamily: 'Avenir',
            marginLeft: 10,

          }}
          value={this.state.input}
          placeholderTextColor={"rgba(198,198,204,1)"}
          onChangeText={(text) => {this.querySpotify({text})}}
          onSubmitEditing={() => {this.inputMessage()}}
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
    console.log("here")
    this.setState({enteringNames: false});
  }
  
  onDonePressSong() {
    this.setState({enteringNames: false, editing: false});
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
  
  directoryText() {
    if(this.state.recChosen) {
      return {
        color: 'black',
        fontSize: 12,
        fontWeight: 'normal',
        fontFamily: 'Avenir',
        marginTop: 18,
        marginLeft: 16
        
      }
    } else {
      return styles.directoryText; 
    }
  }

  addRecepients(text) {
    if(text.length == 0) {
      this.setState({text: "", enteringNames: false}); 
    } else {
      this.setState({text, enteringNames: true});
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={this.listStyle()}>
          <Text
            style={this.directoryText()}>
            To:           
          </Text>   
          {!this.props.new ? (
              <Text
               style={this.userTitle()}>
               {this.props.name.first}
              </Text>
            ) : (
              <TextInput
                style={[styles.userEntry, this.textColor()]}
                placeholder={ 'Person / Group' }
                placeholderTextColor={"rgba(198,198,204,1)"}
                onChangeText={(text) => this.addRecepients(text)}
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
            renderComposer={this.renderComposer}
            onInputTextChanged={this.querySpotify}
          />
        ) : (
          this.renderSpotify(this.props)
        ))}
      </View>
    )
  }
}

export default Conversation