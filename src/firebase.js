import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyDtNCvPd0jNwYfEHOW8ba50cnZE16lSmcs",
    authDomain: "carbonfootprint-91c40.firebaseapp.com",
    databaseURL: "https://carbonfootprint-91c40.firebaseio.com",
    projectId: "carbonfootprint-91c40",
    storageBucket: "carbonfootprint-91c40.appspot.com",
    messagingSenderId: "254375918936"
  };

firebase.initializeApp(config);

export default class Database {

  static setDistance(distance) {
    if (distance) {
      console.log(distance);
      console.log(firebase.database().ref('distances'));
      firebase.database().ref('distances').push({
        distance: distance
      }, function (error) {
        console.log(error);
      });

    }
  }

}
