import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class MyGeolocation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        console.log(JSON.stringify(position));
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  // componentDidMount() {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       console.log(position);
  //       var initialPosition = JSON.stringify(position);
  //       console.log(initialPosition);
  //     }
  //   );
  // }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <View>
        <Text>!</Text>
      </View>
    );
  }
}
