import * as React from 'react';
import { TextInput, StyleSheet, Text, Button, View, TouchableOpacity, Image} from 'react-native'
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import ProfileIconButton from './ProfileIconButton';


export default function ChangeUsernameForm() {
    // const [username, setUsername] = useState('');
    function setUsername(username) {
        console.log(username);
        //use this with firebase.
    }

    return (
        <View style={{width: '100%'}}>
            <Text > Change Username</Text>
            <TextInput
                placeholder="New Username"
                placeholderTextColor = "gray"
                underlineColorAndroid = "transparent"
                style={styles.input}

                onChangeText={(username) => setUsername(username)}
            />
            <Text > Change Bio </Text>
            <TextInput
                placeholder="New Bio"
                placeholderTextColor = "gray"
                underlineColorAndroid = "transparent"
                style={styles.input}

                onChangeText={(username) => setUsername(username)}
            />

        </View>


    );
}

const styles = StyleSheet.create({
    container: {
       paddingTop: 23
    },
    input: {
       margin: 10,
       height: 40,
       borderColor: '#000000',
       borderWidth: 1,
       paddingLeft: 5
    }

 })