import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  Dimensions,
  Button,
  Linking,
  TouchableOpacity
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
    flex: 3,
    width: Dimensions.get('window').width * 0.8,
    borderRadius: 40,
    marginLeft: 35,
    // width: Dimensions.get('window').width,
    marginTop: 10,
    alignItems: 'flex-end',
  },
  textBlock: {
    flex: 2,
    flexDirection: 'column',
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackName: {
    fontSize: 24,
    color: '#406666',
    letterSpacing: 0.5, 
    marginBottom: 5,
    fontFamily: 'Avenir',
  },
  artistName: {
    fontSize: 16,
    color: '#CD5C6A',
    fontFamily: 'Avenir',
  },
  donorName: {
    fontSize: 12, 
    fontFamily: 'Avenir',
    color: '#406666',
    marginTop: 4,
    marginLeft: 6, 
  },
  messageBlock: {
    backgroundColor: '#2ABA67',
    flex: 0.5,
  },
  sharing: {
    fontSize: 12,
    fontFamily: 'Avenir',
    color: '#95a5a6',
  },
  chips: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#406666',
    marginLeft: 5,
    width: 60,
    height: 20,
    borderRadius: 30,
  },
  names: {
    fontSize: 8,
    color: '#406666',
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 1,
    marginTop: 3,
    textAlign: 'center',
    fontFamily: 'Avenir',
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
      <Image source={{ uri: props.image}} style={styles.photo} />
      <View style={styles.textBlock}>
        <Text style={styles.trackName}>
          {`${props.track}`}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.artistName}>
            {`${props.artist} `}
          </Text>
          <Text style={styles.donorName}>
           from {`${props.userId}`}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => openTrack()}
          style={{ backgroundColor: '#406666', marginTop: 20, borderRadius: 20, padding: 10, width: 180 }}>
          <Text
            style={{ backgroundColor: 'rgba(0,0,0,0)', color: 'white', textAlign: 'center', fontFamily: 'Avenir' }}
          >Listen</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginTop: 50, }}>
          <Text style={styles.sharing}>
            Shared by 31 others:
          </Text>
          <View style={styles.chips}>
            <Text style={styles.names}>
              Musit Team
            </Text>
          </View>
          <View style={styles.chips}>
            <Text style={styles.names}>
              Jared
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.messageBlock}> 
        <Text style={{ color: 'white', textAlign: 'center', fontFamily:'Avenir', paddingTop: 16, fontSize: 16  }}>Recommend to {`${props.id}`}</Text>
      </View> 
    </View>
  )
}

DisplayRecommendation.propTypes = {}
DisplayRecommendation.defaultProps = {}

export default DisplayRecommendation