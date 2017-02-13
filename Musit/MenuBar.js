import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  menuButton: {
    backgroundColor:"#ecf0f1", 
    width:6, 
    height:6, 
    borderRadius: 20, 
    marginTop: 5,
    marginLeft: 3
  }
});

const MenuBar = (props) => (
  <View style={{ flexDirection:'row', marginRight: 14 }}>
    <View style={styles.menuButton}></View>
    <View style={styles.menuButton}></View>
    <View style={styles.menuButton}></View>
  </View>
);

export default MenuBar; 