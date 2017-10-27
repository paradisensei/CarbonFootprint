import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class MyGeolocation extends Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        var initialPosition = JSON.stringify(position);
        console.log(initialPosition);
      }
    );
  }

  render() {
    return (
      <View>
        <Text>!</Text>
      </View>
    );
  }
}
