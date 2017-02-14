import React, { Component, } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Image,
  ListView,
} from 'react-native'
import Contact from './Contact'
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
});

class Conversation extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {messages: [], enteringNames: false, dataSource: ds.cloneWithRows(data), message: ''};
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
            image: 'https://upload.wikimedia.org/wikipedia/en/1/11/Dive_tycho_album.jpg',
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
            image: 'https://s-media-cache-ak0.pinimg.com/originals/27/10/2f/27102fbb71756b46f9979b85529ac882.jpg',
          },
        ],
      });
    }
  }
  
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
  
  renderMessageText(props) {
    let color = 'white'
    if(props.currentMessage.user._id != props.user._id) {
      color = 'black'
    }
    return(
      <Text style={{ fontFamily:'Avenir', marginLeft:10, width: 175, paddingRight: 10, color: color }}>
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
        onChangeText={(text) => {this.setState({text})}}
        onSubmitEditing={() => {this.setState({text: ''})}}
        value={(this.state && this.state.text) || ''}
      />
    );
  }
  
  renderMessageImage(props) {
    const url = props.currentMessage.image;
    let color = 'white'
    if(props.currentMessage.user._id != props.user._id) {
      color = 'black'
    }
    return(
      <View style={{ flexDirection: 'row' }}>
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
            Track Name
          </Text>
          <Text
            style={{
              color: color,
              fontSize: 12,
              fontWeight: 'normal',
              fontFamily: 'Avenir',
            }}>
            Artist Name
          </Text>
        </View>
      </View>
    );
  }
  
  submitText() {
    console.log("hi"); 
  }
  
  onDonePressList() {
    this.setState({enteringNames: false});
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
               style={{
                 color: 'black',
                 fontSize: 14,
                 fontWeight: 'normal',
                 fontFamily: 'Avenir',
                 marginTop: 79, 
                 marginLeft: 6
               }}>
               {this.props.name.first}
              </Text>
            ) : (
              <TextInput
                style={{
                  height: 20, 
                  width:  200 ,
                  fontFamily: 'Avenir',
                  fontSize: 14,
                  marginTop: 78,
                  marginLeft: 6
                }}
                placeholder={ 'Person / Group' }
                placeholderTextColor={"rgba(198,198,204,1)"}
                onChangeText={(text) => {this.setState({text, enteringNames: true})}}
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
        ) : (
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            isAnimated={true}
            user={{
              _id: 1,
            }}
            renderMessageText={this.renderMessageText}
            renderMessageImage={this.renderMessageImage}
            renderComposer={this.renderComposer}
          />
        )}
      </View>
    )
  }
}

export default Conversation