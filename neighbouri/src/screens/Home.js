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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';

export default function HomeScreen({navigation}) {
  const [show, setShow] = useState(false);
  const [photo, setPhoto] = useState(null);
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

  choosePhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, (response) => {
      console.log('response', response);
    });
  };

  takePhoto = () => {
    const options = {
      noData: true,
    };
    launchCamera(options, (response) => {
      console.log('response', response);
    });
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
              title="Add a picture"
              onPress={this.takePhoto}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShow(false);
              }}>
              <Text>{'Close'}</Text>
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
});
