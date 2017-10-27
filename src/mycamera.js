import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Camera from 'react-native-camera';

export default class MyCamera extends Component {
  render() {
    return (
      <View style={styles.container}>
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

  componentDidMount() {
    this.camera.capture()
      .then(data => {
        const formData = new FormData();
        formData.append('picture', {
          uri: data.path, name: 'photo.jpg', type: 'image/jpg'
        });

        //TODO specify server url
        fetch("URL", {
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'multipart/form-data;'
           },
           body: formData,
        })
         .then(response => {
             console.log(response);
         })
         .catch(err => console.log(err));
      })
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
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
