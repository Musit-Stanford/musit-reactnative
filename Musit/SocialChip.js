import React, { Component, } from 'react'
import { View, ListView } from 'react-native'
import GenreChip from './GenreChip'
import data from './demoData.js'
import ThreadParticipant from './ThreadParticipant'
class SocialChip extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        dataSource: ds.cloneWithRows(data),
    };
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', marginTop: 7, justifyContent: 'space-between' }}>
        <View style={{marginRight: 6}}>
          <GenreChip genre={this.props.location.state}></GenreChip>
          <GenreChip genre='House'></GenreChip>
        </View>
        <View>
          <ListView
            horizontal={true}
            dataSource={this.state.dataSource}
            renderRow={(data, sectionID, rowID) => <ThreadParticipant {...data} row={rowID} navigator={this.props.navigator}/>}
            scrollEnabled={false}
          />
        </View>
      </View>
    )
  }
}

export default SocialChip