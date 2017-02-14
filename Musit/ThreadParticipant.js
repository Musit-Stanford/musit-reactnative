import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

let photo = {
  height: 24,
  width: 24,
  alignItems: 'flex-end',
  borderRadius: 12,
}

function photoMargin(key) {
  if(key == 0) {
    return photo; 
  } else {
    return {
      height: 24,
      width: 24,
      alignItems: 'flex-end',
      borderRadius: 12,
      marginLeft: -8,
    }
  }
}

const ThreadRow = (props) => (
  <View style={styles.container}>
    <Image source={{ uri: props.picture.medium}} style={photoMargin(props.row)} />
  </View>
);

export default ThreadRow;