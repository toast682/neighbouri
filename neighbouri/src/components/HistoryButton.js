import * as React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function HistoryButton(navigation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => {
          navigation.push('History');
        }}>
          <Image source={require('../assets/History.png')} style={globalStyles.standardIcon}/>
        </TouchableOpacity>
      </View>
    );
  }