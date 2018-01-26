'use strict';

import React, { Component } from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';


// PureComponent is re-rendered less, so could be more performant
class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.index);
  }

  render() {
    const item = this.props.item;
    const price = item.price_formatted;
    return (
      <TouchableHighlight
        onPress={this._onPress}
        underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: item.img_url }} />
            <View style={styles.textContainer}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    )
  }
}

export default class SearchResults extends Component<{}> {
  _keyExtractor = (item, index) => index;

  // TODO (Franklin): Look into the onPressItem attribute to see what the pass-in is
  _onPressItem = (index) => {
    console.log('clicked on home on index: ' + index);
  }

  _renderItem = ({item, index}) => {
    return (
      <ListItem
        item={item}
        index={index}
        onPressItem={this._onPressItem}
      />
      // <TouchableHighlight
      //   underlayColor='#dddddd'>
      //   <View>
      //     <Text>{item.title}</Text>
      //   </View>
      // </TouchableHighlight>
    );
  };

  // keyExtractor is used by React to efficiently managing the list
  // renderItem renders each item in the list
  // this means each item in listings has a `title` attribute
  render() {
    return (
      <FlatList
        data={this.props.listings}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    )
  }
}

const styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
})
