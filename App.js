// App.js

import React, { useState } from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import {REACT_APP_IPSTACK_ACCESS_KEY, REACT_APP_POSSTACK_ACCESS_KEY} from '@env'
//import Geolocation from '@react-native-community/geolocation'
import GetLocation from 'react-native-get-location'
import { NetworkInfo } from "react-native-network-info"
import DeviceInfo from 'react-native-device-info'

export default function App() {

  const [loading, setLoading] = useState(true)

  const [city, setCity] = useState()

  const [region_code, setRegionCode] = useState()

  const [ipAddress, setIPAddress] = useState()

  const [deviceName, setDeviceName] = useState()

  const [deviceType, setDeviceType] = useState()

  const [isEmulator, setIsEmulator] = useState()

  const myIP = "65.24.247.147"

  // Get Local IP
  NetworkInfo.getIPAddress().then(ip => {
    setIPAddress(myIP)
  });

  /*const IP_KEY = REACT_APP_IPSTACK_ACCESS_KEY

  const ipResponse = 'http://api.ipstack.com/'+ipAddress+'?access_key='+IP_KEY

  fetch(ipResponse)
      .then(response => response.json())
      .then(data => console.log(data));*/

  DeviceInfo.getDeviceName().then(name => {
    // iOS: "Becca's iPhone 6"
    // Android: ?
    // Windows: ?
    setDeviceName(name)
  });

  DeviceInfo.isEmulator().then(value => {
    setIsEmulator(value)
  });

  DeviceInfo.getDevice().then(type => {
    setDeviceType(type)
  });

  function getLocation() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000
    })
        .then(position => {
          if (position != undefined) {
            const POS_KEY = REACT_APP_POSSTACK_ACCESS_KEY

            let lat = position.latitude
            let long = position.longitude

            const posResponse = 'http://api.positionstack.com/v1/reverse?access_key='
                +POS_KEY
                +'&query='
                +lat
                +','
                +long
                +'&limit=1&fields=results.locality,results.region'

            fetch(posResponse)
                .then(response => response.json())
                .then(data => {
                  if (data != undefined) {
                    console.log(data)
                    if (data.data[0].locality == null) {
                      setCity(data.data[0].administrative_area)
                    } else {
                      setCity(data.data[0].locality)
                    }
                    setRegionCode(data.data[0].region_code)
                  }
                  setLoading(false)
                })
          }
        })
        .catch(error => {
          const { code, message } = error;
          console.log(code, message);
        })
  }

  const LocalNotification = () => {
    PushNotification.localNotification({
      autoCancel: true,
      bigText:
          'This is local notification demo in React Native app. Only shown, when expanded.',
      subText: 'Local Notification Demo',
      title: 'Local Notification Title',
      message: 'Expand me to see more',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      actions: '["Yes", "No"]'
    })
  }

  return (
      <View style={styles.container}>
        <TouchableOpacity onPress={getLocation}>
          <Text style={styles.welcome}>Device Info</Text>
          <Text style={styles.info}>Location: {loading ? "Press Me" : `${city}, ${region_code}`}</Text>
          <Text style={styles.info}>IP Address: {ipAddress}</Text>
          <Text style={styles.info}>Device Name: {deviceName}</Text>
          <Text style={styles.info}>Device Type: {deviceType}</Text>
          <Text style={styles.info}>isEmulator? {isEmulator ? "True" : "False"}</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10
  },
  info: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10
  }
})
