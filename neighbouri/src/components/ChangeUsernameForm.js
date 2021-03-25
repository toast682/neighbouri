import * as React from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import ProfileIconButton from './ProfileIconButton';
import firestore from '@react-native-firebase/firestore';

export default function ChangeUsernameForm() {
  const currentUser = auth().currentUser;
  const currentUserId = currentUser.uid;
  const usersCollection = firestore().collection('Users');
  
  const [username, setUsername] = useState('');
  const [biography, setBiography] = useState('');
  const [user, setUser] = useState();
  const [placeHolderUsername, setPlaceHolderUsername] = useState('');
  const [placeHolderBiography, setPlaceHolderBiography] = useState('');

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    await firestore()
      .collection('Users')
      .doc(currentUserId)
      .get()
      .then((userDoc) => {
        setPlaceHolderUsername(userDoc.data().Username);
        if (userDoc.data().Biography) {
          setPlaceHolderBiography(userDoc.data().Biography);
        }
      });
  }

  async function sendToFirebase() {
    await firestore()
      .collection('Users')
      .doc(currentUserId)
      .update({
        Username: username,
        Biography: biography,
      })
      .catch((e) => {
        console.log('There was an error getting user: ', e);
      });
  }

  return (
    <View style={{width: '100%'}}>
      <Text> Change Username</Text>
      <TextInput
        placeholder={placeHolderUsername ? placeHolderUsername : 'new username'}
        placeholderTextColor="gray"
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(username) => setUsername(username)}
      />
      <Text> Change Bio </Text>
      <TextInput
        placeholder={
          placeHolderBiography ? placeHolderBiography : 'new biography'
        }
        placeholderTextColor="gray"
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(biography) => setBiography(biography)}
      />
      <Button style={styles.button} title="Submit" onPress={sendToFirebase} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
  },
  input: {
    margin: 10,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5,
  },
});
