import * as React from 'react';
import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

async function logIn(email, password, setErrorMessage) {
    if(!email) {
        setErrorMessage('Please enter your email');
        return;
    } else if (!password) {
        setErrorMessage('Please enter your password');
        return;
    }

    await auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        console.log('Logged in');
    })
    .catch(error => {
        console.log('invalid email or password');
        setErrorMessage('invalid email or password, please try again');
    });
}

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    return (
    <View style={styles.container}>

        <Text style={styles.title}>{"Neighbouri"}</Text>

        <View style={styles.textField}>
              <TextInput
                 placeholder="Email"
                 placeholderTextColor="#000000"
                 onChangeText={(email) => setEmail(email)}
              />
        </View>

        <View style={styles.textField}>
              <TextInput
                 placeholder="Password"
                 placeholderTextColor="#000000"
                 secureTextEntry={true}
                 onChangeText={(password) => setPassword(password)}
              />
        </View>

        <Button
            title="Log In"
            color="#3dafe0"
            onPress={() => {logIn(email, password, setErrorMessage)}}
        />

        <View>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>

        <TouchableOpacity
            title=""
            style={styles.createAccountLink}
            onPress={() => navigation.navigate('SignUp')}
        >
            <Text style={styles.createAccountLinkText}>New? Create an account</Text>
        </TouchableOpacity>
    </View>
    );
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: "#ffffff",
     alignItems: "center",
     justifyContent: "center",
   },

  textField: {
    backgroundColor: "#b3b7ba",
    width: "70%",
    height: 55,
    justifyContent: "center",
    marginBottom: 40,
  },

  title: {
    color: "#3dafe0",
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 70,
  },

  errorMessage: {
    color: "#eb506c",
    fontSize: 15,
    marginTop: 30,
  },

  createAccountLink: {
    fontSize: 15,
    marginTop: 30,
  },

  createAccountLinkText: {
    color: "#3dafe0",
    fontSize: 15,
    height: 50
  }
 });