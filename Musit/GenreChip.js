import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    marginTop: 3,
    height: 15,
    width: 55,
    borderRadius: 20,
    backgroundColor: '#4A90E2'
  }
});

const GenreChip = (props) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'white',
          fontSize: 8,
          fontWeight: 'normal',
          fontFamily: 'Avenir',
          textAlign: 'center',
          width: 50,
          marginTop: 2,
          marginLeft: 2
        }}>
        {props.genre}
      </Text>
    </View>
  )
}

GenreChip.propTypes = {}
GenreChip.defaultProps = {}

export default GenreChip