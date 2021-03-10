import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {launchCamera} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';
import NumericInput from 'react-native-numeric-input';
import { Rating } from 'react-native-ratings';

const listingsCollection = firestore().collection('Listings');

export default function HomeScreen({navigation}) {
  const [photo, setPhoto] = useState(null);
  const [image, setImage] = useState('');
  const [search, setSearch] = useState('');
  const [fullListing, setFullListings] = useState([]);
  const [listings, setListings] = useState([]);
  const [photoURI, setPhotoURI] = useState('');
  const [show, setShow] = useState(false);
  const [currRating, setCurrRating] = useState(0);

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
          buildObject(doc);
        });
      });
  }

  async function buildObject(doc) {
    const reference = await storage().ref(doc.data().ImageURI).getDownloadURL();
    doc.data().photo = {uri: reference};
    setFullListings((prev) => [...prev, doc.data()]);
    setListings((prev) => [...prev, doc.data()]);
  }
  //TODO: make adding a posting require having a name, description, etc.
  function searchList(keyword) {
    setSearch(keyword);
    if (keyword === '') {
      setListings(fullListing);
    } else {
      setListings(
        fullListing.filter(
          (text) =>
            text.Item.toLowerCase().includes(keyword) ||
            text.Description.toLowerCase().includes(keyword) ||
            text.Name.toLowerCase().includes(keyword),
        ),
      );
    }
  }

  function showRating(rating) {
    setCurrRating(rating);
    setShow(true);
  }

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
            onChangeText={(text) => searchList(text)}
          />
        }
        style={{width: '90%'}}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('ListingDetails', item)}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 8,
                flexDirection: 'row',
                marginVertical: 10,
              }}>
              <Image
                source={item.photo}
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
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.Name}
      />
      <Button
        title="Add a posting"
        onPress={() => {
          navigation.navigate('CreatePosting');
        }}
      />

      <Modal
        transparent={true}
        visible={show}
      >
        <View style={styles.modalOuterContainer}>
            <View style={styles.modalInnerContainer}>
                <Text style={styles.title}> Seller Review </Text>
                <Rating showRating imageSize={40} readonly startingValue={currRating} />
                <TouchableOpacity style={styles.button} onPress={()=>{setShow(false)}}>
                    <Text>{"Close"}</Text>
                </TouchableOpacity>
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
  input: {
    margin: 10,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    width: 200,
  },
});
