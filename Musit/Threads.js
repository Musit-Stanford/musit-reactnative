import React, { Component, } from 'react'
import { View, ListView, StyleSheet } from 'react-native'
import data from './demoData.js'
import Row from './Row'
import ThreadConvo from './ThreadConvo'

const styles = StyleSheet.create({
  separator: {
    width: 320,
    marginLeft: 30,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CACACA',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
});

class Threads extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        dataSource: ds.cloneWithRows(data),
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) => <ThreadConvo {...data} navigator={this.props.navigator}/>}
          scrollEnabled={false}
        />
      </View>
    )
  }
}

export default Threads