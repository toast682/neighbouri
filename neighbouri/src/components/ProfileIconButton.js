import * as React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function ProfileIconButton() {
    return (
      <View style={{ margin: 30, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => {
          console.log('change profile pic');
        }}>
          <Image source={require('../assets/profile-icon.png')} style={globalStyles.standardIcon}/>
        </TouchableOpacity>
      </View>
    );
  }