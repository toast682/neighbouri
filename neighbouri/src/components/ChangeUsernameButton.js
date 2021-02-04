import * as React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import  {Text } from 'react-native';
import {TextInput} from 'react-native'
export default function ChangeUsernameButton() {
    // const [username, setUsername] = useState('');
    return (
        <View>
        <TextInput placeholder='Change Username'/>
        </View>
    );
  }