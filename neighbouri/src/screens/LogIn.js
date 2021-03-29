import * as React from 'react';
import {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Image } from 'react-native';

async function logIn(email, password, setErrorMessage) {
  if (!email) {
    setErrorMessage('Please enter your email');
    return;
  } else if (!password) {
    setErrorMessage('Please enter your password');
    return;
  }

  await auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Logged in');
    })
    .catch((error) => {
      console.log('invalid email or password');
      setErrorMessage('invalid email or password, please try again');
    });
}

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          height: 130,
          alignSelf: 'center',
          marginTop: 50,
        }}>
          <Image style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('../assets/Logo.png')}/>
        </View>
        <View
        style={{
          width: '130%',
          height: 150,
          alignSelf: 'center',
          marginBottom: 20
        }}>
          <Image style={{width: '100%', height: '100%', resizeMode: 'cover'}} source={require('../assets/Illustration.png')}/>
        </View>
      <TextInput
        placeholder="Email"
        placeholderTextColor="gray"
        style={styles.inputStyle}
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="gray"
        style={styles.inputStyle}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <View style={styles.signUpButton}>
        <Button
          title="LOGIN"
          color={Platform.OS === "android" ? '#538b61' : 'white'}
          onPress={() => {
            logIn(email, password, setErrorMessage);
          }}
        />
      </View>

      <View>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>

      <TouchableOpacity
        title=""
        style={styles.createAccountLink}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.createAccountLinkText}>
          Don't have an account yet?{' '}
          <Text style={{color: '#f9a528'}}>Signup</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0CA',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  titleText: {
    fontSize: 30,
    marginVertical: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  signUpButton: {
    marginTop: 25,
    width: '100%',
    backgroundColor: '#538b61',
    borderRadius: 8,
  },
  errorMessage: {
    color: '#eb506c',
    fontSize: 15,
    marginTop: 30,
  },
  createAccountLink: {
    fontSize: 15,
    marginTop: 30,
  },
  createAccountLinkText: {
    color: 'black',
    fontSize: 15,
    height: 50,
  },
  inputStyle: {
    height: 40,
    width: '100%',
    borderColor: '#6c6767',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    paddingLeft: 5,
    backgroundColor: 'white'
  },
});
