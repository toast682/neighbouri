import * as React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function SubmitButton(navigation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => {
          navigation.pop();
        }}>
          <Image source={require('../assets/Checkmark.png')} style={globalStyles.standardIcon}/>
        </TouchableOpacity>
      </View>
    );
  }