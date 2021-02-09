import * as React from 'react';
import { View, TouchableOpacity, Image, Button } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function SettingButton(navigation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <TouchableOpacity onPress={() => {
          navigation.push('ProfileInfo');
        }}>
          <Image source={require('../assets/Setting.png')} style={globalStyles.standardIcon}/>
        </TouchableOpacity>
      </View>
    );
  }