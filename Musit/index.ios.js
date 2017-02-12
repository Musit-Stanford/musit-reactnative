import NavigationBar from 'react-native-navbar'
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
} from 'react-native'
var SearchBar = require('react-native-search-bar');
import Row from './Row'
import ThreadRow from './ThreadRow'
import data from './demoData.js'

export default class Musit extends Component {
  constructor(props) {
      super(props);

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
          dataSource: ds.cloneWithRows(data),
      };
  }
  
  render() {
    return (
      <View>
        <NavigationBar
          title={{ title: 'MUSIT', tintColor: "rgba(170,170,170,1)", }}
          rightButton={{ title: '+  ', tintColor: "black" }}
          style={{ backgroundColor: "rgba(251,251,251,1)", }}
          statusBar={{ tintColor: "white", }}
        />
        <SearchBar
          ref='searchBar'
          placeholder='Search Recommendations'
          hideBackground={true}
          fontFamily='Avenir'
        />
        <View style={{ padding: 10 }}>
          <Text
            style={{
              color: "rgba(147,147,147,1)",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "Avenir",
              letterSpacing: 1,
              marginLeft: 10,
            }}>
            RECENT RECOMMENDATIONS
          </Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) => <Row {...data} />}
          scrollEnabled={false}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
        <View style={{ padding: 10, marginTop: 10 }}>
          <Text
            style={{
              color: "rgba(147,147,147,1)",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "Avenir",
              letterSpacing: 1,
              marginLeft: 10,
            }}>
            THREADS
          </Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) => <ThreadRow {...data} />}
          horizontal={true}
          style={{ marginTop: 10 }}
        />
        <View style={{ padding: 10, marginTop: 10 }}>
          <Text
            style={{
              color: "rgba(147,147,147,1)",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "Avenir",
              letterSpacing: 1,
              marginLeft: 10,
            }}>
            MUSIT NETWORK
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  }
});

AppRegistry.registerComponent('Musit', () => Musit);
