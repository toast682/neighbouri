import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {launchCamera} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';
import NumericInput from 'react-native-numeric-input';

const listingsCollection = firestore().collection('Listings');

export default function CreatePostingScreen({navigation}) {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [photoURI, setPhotoURI] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const takePhoto = () => {
    const options = {
      noData: true,
    };
    launchCamera(options, (response) => {
      console.log('response', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};
        setPhotoURI(response.fileName);
        setPhoto(source);
      }
    });
  };

  const uploadImage = async () => {
    const {uri} = photo;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const task = storage().ref(filename).putFile(uri);
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
  };

  async function submitPosting() {
    try {
      uploadImage();
      listingsCollection.add({
        Address: 'User Address',
        ListingID: '000000000',
        Name: 'User name',
        PostedDate: new Date().toDateString(),
        SellerID: '0000000',
        Suite: '1234',
        ImageURI: `${
          photoURI
            ? photoURI
            : 'rn_image_picker_lib_temp_18cd6beb-43d0-45a4-85d0-a08103854694.jpg'
        }`,
        Item: `${itemName ? itemName : ''}`,
        Description: `${description ? description : ''}`,
        Price: price,
        Quantity: quantity,
      });
      navigation.navigate('Home');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> New Posting </Text>

      <Button
        style={styles.button}
        title="Take a picture"
        onPress={takePhoto}
      />
      <Text> Description </Text>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(description) => setDescription(description)}
      />
      <Text> Item Name </Text>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(itemName) => setItemName(itemName)}
      />
      <Text> Price </Text>
      <NumericInput type="up-down" onChange={(value) => setPrice(value)} />

      <Text> Quantity </Text>
      <NumericInput type="up-down" onChange={(value) => setQuantity(value)} />

      <Button style={styles.button} title="Submit" onPress={submitPosting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },

  title: {
    color: '#3dafe0',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 70,
  },

  button: {
    color: '#3dafe0',
    margin: 50,
  },

  input: {
    margin: 10,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    width: 200,
  },
});
