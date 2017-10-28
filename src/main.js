import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import Camera from 'react-native-camera';

export default class Main extends Component {

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
      { timeout: 2000, maximumAge: 1000 }
    );
  }

  componentDidMount() {
    // register geolocation watcher
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
        console.log("Covered distance = ", distance);

        position.distance = distance;
        this.setState(position);
      },
      error => console.log(error),
      { maximumAge: 1000, distanceFilter: 1 }
    );

    // set interval for taking photos every 10 seconds
    setInterval(this.takePhoto.bind(this), 10000);
  }

  takePhoto() {
    this.camera.capture()
      .then(data => {
        const formData = new FormData();
        formData.append('file', {
          uri: data.mediaUri, name: 'photo.jpg', type: 'image/jpg'
        });

        return fetch("http://192.168.1.8:8080/upload", {
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'multipart/form-data;'
           },
           body: formData,
        });
      })
      .then(response => {
         console.log(response);
         //TODO set count
         this.setState({
           count: 1
         });
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    let count = <Text>Идет распознавание</Text>;
    if (this.state.count) {
      count = this.state.count;
    }
    return (
        <View style={styles.camera}>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            type={Camera.constants.Type.front}
            playSoundOnCapture={false}>
          </Camera>
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

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});