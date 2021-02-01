import * as React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../../styles/globalStyles';

export default function BackButton(navigation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => {
          navigation.pop();
        }}>
          <Image source={require('../../assets/Back.png')} style={globalStyles.standardIcon}/>
        </TouchableOpacity>
      </View>
    );
  }