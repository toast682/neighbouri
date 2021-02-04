import * as React from 'react';
import {Button, Text, View} from 'react-native';
import GeoButton from '../component/GeoButton';

export default function ProfileScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Profile!</Text>
      <Text>Username: Bob</Text>
    </View>
  );
}
