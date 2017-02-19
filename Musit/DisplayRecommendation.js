import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  Dimensions,
  Button,
  Linking
} from 'react-native'
const styles = StyleSheet.create({
  container: {
    flex: 2,
    marginTop: 60,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    flex: 4,
    width: Dimensions.get('window').width,
    alignItems: 'flex-end',
  },
  textBlock: {
    flex: 2,
    flexDirection: 'column',
    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackName: {
    fontSize: 22,
    color: '#9C9C9C',
    letterSpacing: 0.5, 
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Avenir',
  },
  artistName: {
    fontSize: 14,
    color: '#CD5C6A',
    fontFamily: 'Avenir',
  },
  donorName: {
    fontSize: 10, 
    fontFamily: 'Avenir',
    color: '#9BAFB1',
    marginTop: 4,
    marginLeft: 6, 
  },
  messageBlock: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  sharing: {
    fontSize: 12,
    fontFamily: 'Avenir',
    color: '#DBDBDB',
  },
  chips: {
    backgroundColor: '#D8D8D8',
    marginLeft: 5,
    width: 50,
    height: 20,
    borderRadius: 30,
  }
});


const DisplayRecommendation = (props) => {
  console.log(props);

  function openTrack() {
    var uri = "https://open.spotify.com/track/2qC1sUo8xxRRqYsaYEdDuZ";
    console.log(uri); 
    Linking.canOpenURL(uri).then(supported => {
      if (supported) {
        Linking.openURL(uri);
      } else {
        console.log('Don\'t know how to open URI: ' + uri);
      }
    });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: props.picture.large}} style={styles.photo} />
      <View style={styles.textBlock}>
        <Text style={styles.trackName}>
          {`${props.name.first}`}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.artistName}>
            {`${props.name.last} `}
          </Text>
          <Text style={styles.donorName}>
           from {`${props.name.title}`}
          </Text>
        </View>
        <Button
          onPress={() => openTrack()}
          title="Listen"
          //color=""
        />
        <View style={{ flexDirection: 'row', marginTop: 50 }}>
          <Text style={styles.sharing}>
            Shared by 31 others:
          </Text>
          <View style={styles.chips}>
          </View>
          <View style={styles.chips}></View>
        </View>
      </View>
      { /* <View style={styles.messageBlock}> 
      </View> */}
    </View>
  )
}

DisplayRecommendation.propTypes = {}
DisplayRecommendation.defaultProps = {}

export default DisplayRecommendation