import React from 'react'
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 45,
    width: 45,
    alignItems: 'flex-end',
    borderRadius: 4,
    marginRight: 8,
  },
  textBlock: {
    flexDirection: 'column',
    marginLeft: 12,
  },
  trackName: {
    fontSize: 18,
    letterSpacing: 0.5, 
    marginBottom: 10,
    fontFamily: 'Avenir',
  },
  artistName: {
    fontSize: 12,
    color: '#8B8B8B',
    fontFamily: 'Avenir',
  },
  donorName: {
    fontSize: 10, 
    fontFamily: 'Avenir',
    color: '#61A7F8',
    marginTop: 1.5,
    marginLeft: 10, 
  }
});
const DisplayRecommendation = (props) => {
  return (
    <View style={styles.container}>
    <View style={styles.textBlock}>
      <Text style={styles.trackName}>
        {`${props.name.first}`}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.artistName}>
          {`${props.name.last}`}
        </Text>
        <Text style={styles.donorName}>
          {`${props.name.title}`}
        </Text>
      </View>
    </View>
    <Image source={{ uri: props.picture.large}} style={styles.photo} />
  </View>
  )
}

DisplayRecommendation.propTypes = {}
DisplayRecommendation.defaultProps = {}

export default DisplayRecommendation