import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ListView } from 'react-native';
import Row from './Row'
import ThreadRow from './ThreadRow'
import data from './demoData.js'
import MenuBar from './MenuBar'
var SearchBar = require('react-native-search-bar')

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

class Home extends Component {
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
        <SearchBar
          ref='searchBar'
          placeholder='Search Recommendations'
          hideBackground={true}
          fontFamily='Avenir'
        />
        <ScrollView>
          <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
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
            <MenuBar></MenuBar>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(data) => <Row {...data} />}
            scrollEnabled={false}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
          <View style={{ padding: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
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
            <MenuBar></MenuBar>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(data) => <ThreadRow {...data} />}
            horizontal={true}
            style={{ marginTop: 10 }}
          />
          <View style={{ padding: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
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
            <MenuBar></MenuBar>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Home;