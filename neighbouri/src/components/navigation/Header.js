import * as React from 'react';
import { View } from 'react-native';

export default function Header(leftComponent, middleComponent, rightComponent) {
    return (
        <View style={{ width: '100%', height: "8%", flexDirection: 'row', backgroundColor: 'transparent'}}>
          {leftComponent}
          {middleComponent}
          {rightComponent}
        </View>
    );
  }