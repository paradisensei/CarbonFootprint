import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import Database from './firebase';

export default class MyGeolocation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      distance: 0
    };
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        position = getPosition(position);
        console.log("Got initial position: ",
                    "latitude = ", position.latitude,
                    "longitude = ", position.longitude);
        this.setState(position);
      },
      error => console.log(error),
      { timeout: 1000, maximumAge: 1000 }
    );
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        position = getPosition(position);
        console.log("Got current position: ",
                    "latitude = ", position.latitude,
                    "longitude = ", position.longitude);

        const lat1 = this.state.latitude;
        const lon1 = this.state.longitude;
        const distance = this.state.distance +
                measure(lat1, lon1, position.latitude, position.longitude);
        Database.setDistance(distance);
        console.log("Covered distance = ", distance);

        position.distance = distance;
        this.setState(position);
      },
      error => console.log(error),
      { maximumAge: 1000, distanceFilter: 1 }
    );
  }

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

function getPosition(position) {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  }
}

function measure(lat1, lon1, lat2, lon2) {
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}
