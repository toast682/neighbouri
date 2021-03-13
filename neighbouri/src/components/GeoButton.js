import React from 'react';
import {PermissionsAndroid, Button} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const requestLocationPermission = async () => {
  try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Neighbouri Location Permission',
          message:
            'Neighbouri needs access to your location ' +
            'to connect you with others around you!',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position.coords.latitude, position.coords.longitude);
          },
          (err) => {
            console.error(err);
          },
          {enableHighAccuracy: true, maximumAge: 0},
        );
      } else {
        alert('Permission Denied');
      }
  } catch (err) {
    console.warn(err);
  }
};

const GeoButton = () => {
  return <Button onPress={requestLocationPermission} title="Press me"></Button>;
};

export default GeoButton;
