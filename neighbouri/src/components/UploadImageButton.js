import React from 'react';
import {View, Text, Image, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'react-native-image-picker';
import {useState} from 'react';
import defaultProfilePhoto from '../assets/default-avatar.jpg';

export default function UploadImageButton() {
  const [image, setImage] = useState({});
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {image.uri ? (
        <Image
          source={{uri: image.uri}}
          style={{
            width: 150,
            height: 150,
            borderRadius: 150,
            resizeMode: 'cover',
          }}
        />
      ) : (
        <Image
          source={defaultProfilePhoto}
          style={{
            width: 150,
            height: 150,
            borderRadius: 150,
            resizeMode: 'cover',
          }}
        />
      )}
      <Button title="Choose Photo" onPress={handleChoosePhoto}></Button>
    </View>
  );

  function handleChoosePhoto() {
    const options = {};
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('response', response); // use response with
      if (response) {
        setImage(response);
        const uploadUri =
          Platform.OS === 'ios'
            ? response.uri.replace('file://', '')
            : response.uri;

        const storageRef = storage()
          .ref()
          .child('ProfilePicture')
          .child(auth().currentUser.uid + '.JPG');

        storageRef.putFile(uploadUri).catch((e) => {
          console.log(e);
        });
        return response;
      }
      return response;
    });
  }
}
