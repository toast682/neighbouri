import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {TextInput} from 'react-native-gesture-handler';
import ItemTile from '../components/ItemTile';
import storage from '@react-native-firebase/storage';
import geohash from 'ngeohash';
import Geolocation from 'react-native-geolocation-service';
import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';

export default function HomeScreen(props) {
  const {navigation} = props;
  const [search, setSearch] = useState('');
  const [fullListing, setFullListings] = useState([]);
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loc, setLoc] = useState('c2b2q7');
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userDocumentId, setUserDocumentId] = useState('');
  const currentUser = auth().currentUser;
  const currentUserId = currentUser.uid;
  const isFocused = useIsFocused();

  useEffect(() => {
    getLocation();
    getCurrentUser();
    getData();
    console.log(currentUserId);
  }, [props, isFocused]);

  async function getCurrentUser() {
    await firestore()
      .collection('Users')
      .where('uid', '==', currentUserId)
      .get()
      .then((userDocs) => {
        setUserDocumentId(userDocs.docs[0].id);
        const bookmarks =
          userDocs.docs[0].data() && userDocs.docs[0].data().bookmarks;
        setUserBookmarks(bookmarks);
      })
      .catch((e) => {
        console.log('There was an error getting user: ', e);
      });
  }

  async function getLocation() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Neighbouri Location Permission',
            message:
              'Neighbouri needs access to your location ' +
              'to connect you with others around you!',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log(position.coords.latitude, position.coords.longitude);
              // Comment out line below for faked location
              // setLoc(geohash.encode(position.coords.latitude, position.coords.longitude, 6));
              console.log(
                geohash.encode(
                  position.coords.latitude,
                  position.coords.longitude,
                  6,
                ),
              );
            },
            (err) => {
              console.error(err);
            },
            {enableHighAccuracy: true, maximumAge: 0},
          );
        } else {
          alert('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      Geolocation.requestAuthorization('always').then(() => {
        Geolocation.getCurrentPosition(
          (info) => {
          // Comment out line below for faked location
          // setLoc(geohash.encode(info.coords.latitude, info.coords.longitude, 6));
          console.log(
            geohash.encode(info.coords.latitude, info.coords.longitude, 6),
          );
        },
        (err) => {
          console.log(err)
        },
        { enableHighAccuracy: true, timeout: 150000, maximumAge: 10000});
      });
    }
  }

  async function getData() {
    setFullListings([]);
    setListings([]);
    await firestore()
      .collection('Listings')
      .where('Location', '==', loc)
      .where('Active', '==', true)
      .orderBy('PostedDate', 'desc')
      .get()
      .then((listingDocs) => {
        listingDocs.forEach((doc) => {
          buildObject(doc);
        });
      });
  }

  async function getFiltered(f) {
    setFullListings([]);
    setListings([]);
    await firestore()
      .collection('Listings')
      .where('Category', 'in', f)
      .where('Active', '==', true)
      .where('Location', '==', loc)
      .orderBy('PostedDate', 'desc')
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
            text.Item.toLowerCase().includes(keyword.toLowerCase()) ||
            text.Description.toLowerCase().includes(keyword.toLowerCase()) ||
            text.Name.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{marginHorizontal: '5%'}}
        showsVerticalScrollIndicator={false}
        data={[...new Set(listings)]}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>What your neighbours are selling</Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                padding: 8,
                marginTop: 20,
              }}
              placeholder="Search..."
              placeholderTextColor={'grey'}
              value={search}
              onChangeText={(text) => searchList(text)}
            />
            <FlatList
              data={[
                'All',
                'Bakery',
                'Dairy',
                'Fruit',
                'Vegetable',
                'Meals',
                'Non-Perishable',
              ]}
              style={{marginTop: 20}}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    if (item === 'All') {
                      getData();
                      setFilters([]);
                    } else {
                      if (filters.includes(item)) {
                        let newFilter = filters.filter(
                          (thing) => thing !== item,
                        );
                        setFilters(newFilter);
                        if (newFilter.length === 0) {
                          getData();
                        } else {
                          getFiltered(
                            filters.filter((thing) => thing !== item),
                          );
                        }
                      } else {
                        let newFilter = [...filters, item];
                        setFilters(newFilter);
                        getFiltered(newFilter);
                      }
                    }
                  }}
                  style={{
                    backgroundColor:
                      (!filters.includes(item) && item !== 'All') ||
                      (item === 'All' && filters.length > 0)
                        ? '#f0a17525'
                        : '#f0a175',
                    borderRadius: 20,
                    marginRight: 10,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      color:
                        (!filters.includes(item) && item !== 'All') ||
                        (item === 'All' && filters.length > 0)
                          ? '#f0a175'
                          : 'white',
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/Location.png')}
                style={{
                  width: 20,
                  height: 20,
                }}></Image>
              <Text style={{color: '#f0a175'}}>500m</Text>
            </View>
          </View>
        }
        renderItem={({item, index}) => (
          <ItemTile
            key={index}
            item={item}
            navigation={navigation}
            bookmarks={userBookmarks}
            userDocumentId={userDocumentId}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },

  title: {
    color: 'black',
    fontSize: 24,
    marginTop: 70,
    width: '80%',
    alignSelf: 'flex-start',
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
