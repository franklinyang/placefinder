'use strict'

import React, { Component } from 'react';
import SearchResults from './SearchResults';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native';


// TODO (Franklin): What are best practices for blocks of code that live
// inside vs. outside the Searchpage class?
function urlForQueryAndPage(key, value, pageNumber) {
  const data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber,
  };
  data[key] = value;

  const querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'https://api.nestoria.co.uk/api?' + querystring;
}

export default class SearchPage extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: '',
    }
  }

  // anything on object is automatically added to `this`
  _onSearchTextChanged = (event) => {
    console.log('Text input changed');
    this.setState({'searchString': event.nativeEvent.text});
  }

  _handleResponse = (response) => {
    this.setState({isLoading: false, message: ''});
    if (response.application_response_code.substr(0, 1) === '1') {
      // this.props.navigator.push() moves us to a new screen, and has a back button.
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {listings: response.listings}
      });
    }
    else {
      this.setState({'message': 'No properties found'});
    }
  }

  _executeQuery = (query) => {
    this.setState({isLoading: true});
    fetch(query)
      .then(response => response.json())
      // TODO (Franklin)
      // what does _handleResponse do?
      .then(json => this._handleResponse(json.response))
      .catch(error =>
        this.setState({
          isLoading: false,
          message: 'Something\'s not quite right: ' + error,
        })
      );
    console.debug(query);
  }

  _onSearchPressed = () => {
    const query = urlForQueryAndPage('place_name', this.state.searchString, '1');
    this._executeQuery(query);
  }

  render() {
    const spinner = this.isLoading ? <ActivityIndicator size='large'/> : null;
    // Views can be NESTED but cannot be adjacent to each other
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name or postcode
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this._onSearchTextChanged}
            placeholder="Search via name or postcode"/>
          <Button
            onPress={this._onSearchPressed}
            color='#48BBEC'
            title='Go'/>
        </View>
        <Image source={require('./Resources/house.png')} style={styles.image}/>
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    // grow to fit size of bar
    flexGrow: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
  },
  image: {
    width: 217,
    height: 138,
  },
})
