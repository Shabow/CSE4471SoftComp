// App.js

import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, Text, View, Button, Image } from 'react-native'
import {REACT_APP_IPSTACK_ACCESS_KEY, REACT_APP_POSSTACK_ACCESS_KEY} from '@env'
import GetLocation from 'react-native-get-location'
import { NetworkInfo } from "react-native-network-info"
import DeviceInfo from 'react-native-device-info'

const MY_IP = '65.24.247.147'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [locked, setLocked] = useState(false)
  const [poweredOn, setPoweredOn] = useState(false)
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

  // Get Location
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

            //API String Call
            const posResponse = 'http://api.positionstack.com/v1/reverse?access_key='
                +POS_KEY
                +'&query='
                +lat
                +','
                +long
                +'&limit=1&fields=results.locality,results.region'

            //Fetch Location from API
            fetch(posResponse)
                .then(response => response.json())
                .then(data => {
                  if (data) {
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

  const IP_KEY = REACT_APP_IPSTACK_ACCESS_KEY
  //API String Call
  const ipResponse = 'http://api.ipstack.com/'+ipAddress+'?access_key='+IP_KEY

  //Fetch IP info from API
  fetch(ipResponse)
      .then(response => response.json());

  // Function calls to get Device Info
  DeviceInfo.getDeviceName().then(name => {
    setDeviceName(name)
  });

  DeviceInfo.isEmulator().then(value => {
    setIsEmulator(value)
  });

  DeviceInfo.getDevice().then(type => {
    setDeviceType(type)
  });

  // Alert to report fraudulent requests
  function fraudAlert() {
    Alert.alert('This request has been reported', '', [
      {
        text: "Ok",
        onPress: () => {},
      },
    ])
  }

  // Alert to accept task approval
  function approvalAlert(title) {
    Alert.alert(title, '', [
      {
        text: "Ok",
        onPress: () => {},
      },
    ])
  }

  // Alert to prompt user of reason of denial
  function denyAlert() {
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

  //Alert that displays device info of requested task
  function displayAlert(title, callback) {
    Alert.alert(title,
        `Device Name: ${deviceName} \nDevice Type: ${deviceType} \nLocation: ${city}, ${region} \nIP Address: ${ipAddress}`,
        [
      {
        text: "Approve",
        onPress: callback,
      },
      {
        text: "Deny",
        onPress: denyAlert,
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

  // Displays splash logo image
  const DisplayLogo = () => (
      <Image source = {require('C:/Users/Sean/Documents/OSU/AU20/CSE 4471/Project/TeslaPlan/img/logo.png')}
             style = {{ width: 200, height: 200 }}
      />
  )

  // Displays landing page car image
  const DisplayImage = () => (
      <Image source = {require('C:/Users/Sean/Documents/OSU/AU20/CSE 4471/Project/TeslaPlan/img/car.png')}
             style = {{ resizeMode:'contain', width: 300, height: 300 }}
      />
  )

  // Splash page while fetching device data
  if (loading) {
    return (
        <View style={styles.splash}>
          <DisplayLogo />
          <Text style={styles.text}>*DISCLAIMER: This Demo is not affiliated with Tesla, Inc.</Text>
        </View>
    )
  }

  return (
      <View style={styles.container}>
        <DisplayImage />
        <View style={styles.buttons}>

          <View style={styles.button}>
          <Button
              onPress={() => displayAlert(locked ? 'Incoming Request to Unlock Car' : 'Incoming Request to Lock Car', () => {
                approvalAlert(locked ? 'Car unlocked' : 'Car locked')
                setLocked(!locked)
              })}
              title={locked ? 'Unlock Car' : 'Lock Car'}
              color={"#212121"}
              accessibilityLabel="Press to send request"
              theme="dark"
          />
        </View>
        <View style={styles.button}>
          <Button
              onPress={() => displayAlert(!poweredOn ? 'Incoming Request to Start Car' : 'Incoming Request to Power Off Car', () => {
                approvalAlert(!poweredOn ? 'Car Powered On' : 'Car Powered Off')
                setPoweredOn(!poweredOn)
              })}
              title={!poweredOn ? "Start Car" : "Power Off"}
              color={"#212121"}
              accessibilityLabel="Press to send request"
              theme="dark"
          />
        </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121'
  },
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121'
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
    color: '#f2f2f2',
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
