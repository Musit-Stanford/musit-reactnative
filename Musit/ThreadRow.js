import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 80,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  photo: {
    height: 45,
    width: 45,
    alignItems: 'flex-end',
    borderRadius: 20,
    marginLeft: 22,
  },
  textBlock: {
    flexDirection: 'column',
    width: 90,
  },
  threadName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#7C7C7C',
    marginTop: 10,
  }
});

const Row = (props) => (
  <View style={styles.container}>
    <Image source={{ uri: props.picture.medium}} style={styles.photo} />
    <View style={styles.textBlock}>
      <Text style={styles.threadName}>
        {`${props.location.city}`}
      </Text>
    </View>
  </View>
);

export default Row;