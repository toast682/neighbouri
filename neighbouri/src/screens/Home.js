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

export default function HomeScreen({navigation}) {
  const [show, setShow] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [image, setImage] = useState('');
  const [search, setSearch] = useState('');
  const [fullListing, setFullListings] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setFullListings([]);
    setListings([]);
    await firestore()
      .collection('Listings')
      .orderBy('PostedDate')
      .get()
      .then((listingDocs) => {
        listingDocs.forEach((doc) => {
          setFullListings((prev) => [...prev, doc.data()]);
          setListings((prev) => [...prev, doc.data()]);
        });
      });
  }

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
        const source = { uri: response.uri };
        console.log(source);
        setPhoto(source);
      }
      });
    };

  const uploadImage = async () => {
    const { uri } = photo;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const task = storage()
      .ref(filename)
      .putFile(uri);
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setPhoto(null);
  };

  searchList = (keyword) => {
    setSearch(keyword);
    if (keyword === '') {
      setListings(fullListing);
    } else {
      setListings(fullListing.filter((text) => text.Item == keyword));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Your postings'}</Text>
      <FlatList
        data={[...new Set(listings)]}
        ListHeaderComponent={
          <TextInput
            style={{borderWidth: 1, borderRadius: 8, padding: 8}}
            placeholder="Search"
            placeholderTextColor={'grey'}
            value={search}
            onChangeText={(text) => searchList(text)}></TextInput>
        }
        style={{width: '90%'}}
        renderItem={({item}) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 8,
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            <Image
              source={require('../assets/default-avatar.jpg')}
              style={{width: 80, height: 80, borderRadius: 8}}
            />
            <View style={{padding: 5}}>
              <Text>{item.Item}</Text>
              <Text>
                {item.Quantity} @ {item.Price}
              </Text>
              <Text>
                {item.Name} - #{item.Suite}
              </Text>
              <Text>{item.Description}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.Name}
      />
      <Button
        title="Add a posting"
        onPress={() => {
          setShow(true);
        }}
      />

      <Modal transparent={true} visible={show}>
        <View style={styles.modalOuterContainer}>
          <View style={styles.modalInnerContainer}>
            <Text style={styles.title}> New Posting </Text>

            <Button
              style={styles.button}
              title="Take a picture"
              onPress={takePhoto}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShow(false);
              }}>
              <Text>{'Close'}</Text>
            </TouchableOpacity>

            <Button
              style={styles.button}
              title="Upload"
              onPress={uploadImage}
            />
          </View>
        </View>
      </Modal>
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

  modalOuterContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
  },

  modalInnerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 50,
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },

  button: {
    color: '#3dafe0',
    margin: 50,
  },
});
