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
          title: props.name,
          passProps: {...props},
          firebase: props.firebase,
          backButtonTitle: ' ',
        })}}
    >
    <Image source={{ uri: 'https://facebook.github.io/react/img/logo_og.png'}} style={styles.photo} />
    <View style={styles.textBlock}>
      <Text style={styles.threadName}>
        {`${props.name}`}
      </Text>
    </View>
  </TouchableOpacity>
);

export default ThreadRow;