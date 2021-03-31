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
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {launchCamera} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';
import NumericInput from 'react-native-numeric-input';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';

const listingsCollection = firestore().collection('Listings');

export default function CreatePostingScreen({navigation}) {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [photoURI, setPhotoURI] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [condition, setCondition] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [category, setCategory] = useState('');

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
        Active: true,
        Address: 'User Address',
        ListingID: '000000000',
        Name: 'User name',
        PostedDate: new Date(),
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
        Category: `${category ? category : ''}`,
        Condition: `${condition ? condition : ''}`,
        ExpiryDate: {Day:date.getDate(),Month:date.getMonth() + 1,Year:date.getFullYear()},
        PickupLocation: `${pickupLocation ? pickupLocation : ''}`,
        PickupTime: `${pickupTime ? pickupTime : ''}`,
      });
      navigation.navigate('Home');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> SELL FOOD ITEM </Text>
      <ScrollView>
       <TouchableOpacity style={styles.imageContainer} onPress={takePhoto}>
        {photo === null ? (
          <Image
            source={require('../assets/placeholderimage.jpg')}
            style={styles.image}
            resizeMode='contain'
          />
        ) : (
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            resizeMode='contain'
          />
        )}

      </TouchableOpacity>
      <Text style={styles.note}> Click on the photo to retake </Text>
      <Text style={styles.field}> Title </Text>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(itemName) => setItemName(itemName)}
      />

      <Text style={styles.field}> Price </Text>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(value) => setPrice(value)}
        keyboardType="numeric" />

      <Text style={styles.field}> Quantity </Text>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(value) => setQuantity(value)}
        keyboardType="numeric" />

      <Text style={styles.field}> Category </Text>
      <DropDownPicker
          items={[
              {label: 'Bakery', value: 'Bakery'},
              {label: 'Dairy', value: 'Dairy'},
              {label: 'Fruit', value: 'Fruit'},
              {label: 'Vegetable', value: 'Vegetable'},
              {label: 'Meals', value: 'Meals'},
              {label: 'Non-Perishable', value: 'Non-Perishable'},
          ]}
          defaultValue={category}
          placeholder="Select an item"

          containerStyle={{height: 40,margin:10,marginLeft:40,marginRight:40}}
          style={{backgroundColor: '#ffffff',borderColor: '#000000'}}
          itemStyle={{
              justifyContent: 'center',
          }}
          labelStyle={{
              fontSize: 18,
          }}
          dropDownStyle={{backgroundColor: '#ffffff'}}
          onChangeItem={item => setCategory(item.value)}
      />

      <Text style={styles.field}> Condition </Text>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(condition) => setCondition(condition)}
      />

       <Text style={styles.field}> Expiry Date </Text>
       <TouchableOpacity style={styles.input} onPress={()=>{setShow(true)}}>
       <Text style={{fontSize:18}}> {date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()} </Text>
      </TouchableOpacity>



      <Text style={styles.field}> Description </Text>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.description}
        onChangeText={(description) => setDescription(description)}
      />

      <Text style={styles.field}> Pickup Location </Text>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(pickupLocation) => setPickupLocation(pickupLocation)}
      />

      <Text style={styles.field}> Pickup Time </Text>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        onChangeText={(pickupTime) => setPickupTime(pickupTime)}
      />

      <TouchableOpacity style={styles.button} onPress={submitPosting}>
         <Text style={styles.buttonText}>POST</Text>
      </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent={true}
        visible={show}>
         <View style={styles.modalInnerContainer}>
            <DatePicker
              date={date}
              mode='date'
              format='DD-MM-YYYY'
              onDateChange={setDate}/>
                <TouchableOpacity style={{
                    backgroundColor: "#48CA36",
                    borderRadius: 20,
                    paddingVertical: 7,
                    paddingHorizontal: 7,
                    marginTop:30
                  }}
                  onPress={()=>{
                  setShow(false)
                  console.log(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())}}>
                  <Text style={styles.buttonText}>{"DONE"}</Text>
                </TouchableOpacity>
          </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',

  },

  title: {
    color: '#48CA36',
    fontSize: 30,
    marginTop: 30,
    marginBottom: 20,
    textAlign:'center',
  },

  note: {
    textAlign:'center',
    color:'#d1cdc0',
    fontSize: 15,
  },

  field: {
    marginLeft: 40,
    color: '#F9A528',
    fontSize: 20,
  },

  button: {
    backgroundColor: "#48CA36",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 7,
    marginLeft:270,
    marginRight: 50,

  },

  buttonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
    },

  input: {
    margin: 10,
    marginLeft: 40,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    width: "80%",
    fontSize: 18,
  },

  description: {
    margin: 10,
    marginLeft: 40,
    height: 160,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    width: "80%",
    alignItems: 'center',
  },


  modalInnerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  imageContainer: {
    margin: 119,
    marginVertical: 10,
    marginLeft:120,
    borderWidth: 1,
    borderColor: '#000000',
  },

  image: {
    width: 170,
    height: 170,
  },
});
