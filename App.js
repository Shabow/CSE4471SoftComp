// App.js

import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native'
import {REACT_APP_IPSTACK_ACCESS_KEY, REACT_APP_POSSTACK_ACCESS_KEY} from '@env'
//import Geolocation from '@react-native-community/geolocation'
import GetLocation from 'react-native-get-location'
import { NetworkInfo } from "react-native-network-info"
import DeviceInfo from 'react-native-device-info'

const MY_IP = "65.24.247.147"

export default function App() {
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('UNKNOWN');
  const [region, setRegion] = useState('UNKNOWN');
  const [ipAddress, setIPAddress] = useState()
  const [deviceName, setDeviceName] = useState()
  const [deviceType, setDeviceType] = useState()
  const [isEmulator, setIsEmulator] = useState()

  // Get Local IP
  NetworkInfo.getIPAddress().then(ip => {
    setIPAddress(MY_IP)
  });

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000
    })
        .then(position => {
          if (position) {
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
                  if (data) {
                    console.log(data)
                    if (data.data[0].locality == null) {
                      setCity(data.data[0].administrative_area)
                    } else {
                      setCity(data.data[0].locality)
                    }

                    setRegion(data.data[0].region_code)
                  }

                  setLoading(false)
                })
          }
        })
        .catch(error => {
          const { code, message } = error;
          console.log(code, message);
        })
  }, []);

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

  function fraudAlert() {
    Alert.alert('This request has been reported', '', [
      {
        text: "Ok",
        onPress: () => {},
      },
    ])
  }

  function genericAlert(title) {
    Alert.alert(title, '', [
      {
        text: "Ok",
        onPress: () => {},
      },
    ])
  }

  function mistakeAlert() {
    Alert.alert('Why are you denying this request?', '', [
      {
        text: "It was a mistake",
        onPress: () => {},
      },
      {
        text: "It seemed fraudulent",
        onPress: fraudAlert,
      },
    ])
  }

  function displayAlert(title, callback) {
    Alert.alert(title, `${city}, ${region}`, [
      {
        text: "Approve",
        onPress: callback,
      },
      {
        text: "Deny",
        onPress: mistakeAlert,
      },
    ])
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

  if (loading) {
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Hello</Text>
        </View>
    )
  }

  return (
      <View style={styles.container}>
{/*      <TouchableOpacity>
          <Text style={styles.welcome}>Device Info</Text>
          <Text style={styles.info}>Location: {loading ? "Press Me" : `${city}, ${region_code}`}</Text>
          <Text style={styles.info}>IP Address: {ipAddress}</Text>
          <Text style={styles.info}>Device Name: {deviceName}</Text>
          <Text style={styles.info}>Device Type: {deviceType}</Text>
          <Text style={styles.info}>isEmulator? {isEmulator ? "True" : "False"}</Text>
        </TouchableOpacity>*/}
        <View style={styles.buttons}>
          <View style={styles.button}>
          <Button
              onPress={() => displayAlert("Unlock Car", () => genericAlert('Car unlocked'))}
              title={"Unlock Car"}
              color={"#841584"}
              accessibilityLabel="Press to send request to unlock car"
          />
        </View>
        <View style={styles.button}>
          <Button
              onPress={() => displayAlert("Start Car", () => genericAlert('Car started'))}
              title={"Start Car"}
              color={"#142253"}
              accessibilityLabel="Press to send request to start car"
          />
        </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
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
  },
  buttons: {
    height: 75,
    textAlign: 'center',
    marginTop: 30,
    flexDirection: 'row',
  },
  button: {
    height: 75,
    width: 150,
    margin: 20,
  }
})
