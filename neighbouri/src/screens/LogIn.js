import * as React from 'react';
import { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Link } from '@react-navigation/native';

async function signIn

export default function LoginScreen() {
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
                 secureTextEntry={false}
                 onChangeText={(password) => setPassword(password)}
              />
        </View>

        <Button title="Log In" color="#3dafe0"/>

        <Link to="/" style={styles.createAccountLink}>
            New? Create an account
        </Link>
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

  createAccountLink: {
    color: "#3dafe0",
    fontSize: 15,
    marginTop: 30,
  }
 });