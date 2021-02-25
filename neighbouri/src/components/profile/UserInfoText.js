import * as React from 'react';
import {View, Image, Text} from 'react-native';

export default function UserInfoText(image, text) {
  return (
    <View
      style={{
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image
        source={image}
        style={{width: 20, height: 20, marginRight: 5}}></Image>
      <Text>{text}</Text>
    </View>
  );
}
