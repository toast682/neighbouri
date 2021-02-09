import * as React from 'react';
import { TextInput, StyleSheet, Text, Button, View, TouchableOpacity, Image} from 'react-native'
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import ProfileIconButton from './ProfileIconButton';

export default function ChangeUsernameButton() {
    // const [username, setUsername] = useState('');
    function setUsername(username) {
        console.log(username);
        //use this with firebase.
    }

    function handleSubmitChanges() {
        console.log('hello');
    }
    return (
        <View >
            <Text  > Change Username</Text>
            <TextInput
                placeholder="current username"
                placeholderTextColor = "#000000"
                style={styles.input}
                underlineColorAndroid = "transparent"
                onChangeText={(username) => setUsername(username)}
            />
            <Text > Change Bio </Text>
            <TextInput
                placeholder="current bio"
                placeholderTextColor = "#000000"
                underlineColorAndroid = "transparent"
                style={styles.input}
                onChangeText={(username) => setUsername(username)}
            />
            <Button title="Submit Changes" onPress={() => handleSubmitChanges()} />

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
       borderWidth: 1
    }

 })