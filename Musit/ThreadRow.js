import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Conversation from './Conversation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 80,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  photo: {
    height: 55,
    width: 55,
    alignItems: 'flex-end',
    borderRadius: 25,
    marginLeft: 16,
  },
  textBlock: {
    flexDirection: 'column',
    width: 90,
  },
  threadName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#7C7C7C',
    backgroundColor: 'rgba(0,0,0,0)',
    marginTop: 10,
  }
});

const ThreadRow = (props) => (
  <TouchableOpacity 
    style={styles.container}
    onPress={() => {props.navigator.push({
          component: Conversation,
          title: props.location.city,
          passProps: {...props},
          backButtonTitle: ' ',
        })}}
    >
    <Image source={{ uri: props.picture.medium}} style={styles.photo} />
    <View style={styles.textBlock}>
      {props.location.city == 'Stanford' ? (
        <View style={{ backgroundColor: '#3498db', width: 5, height: 5, left: 15, top: 19, borderRadius: 10}}></View>
      ):(null)}
      <Text style={styles.threadName}>
        {`${props.location.city}`}
      </Text>
    </View>
  </TouchableOpacity>
);

export default ThreadRow;