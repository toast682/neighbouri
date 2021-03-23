import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {HFlatList} from 'react-native-head-tab-view';
import {CollapsibleHeaderTabView} from 'react-native-scrollable-tab-view-collapsible-header';
import Header from '../components/navigation/Header';
import SettingButton from '../components/SettingButton';
import UserInfoText from '../components/profile/UserInfoText';
import {Rating} from 'react-native-ratings';
import moment from 'moment'

export default function ProfileScreen({navigation}) {
  const [photo, setPhoto] = useState();
  const [user, setUser] = useState();
  const [show, setShow] = useState(false);
  const [currRating, setCurrRating] = useState(0);
  const [listings, setListings] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    getData();
    getListingData();
    getPurchaseData();
  }, []);

  async function getListingData() {
    setListings([]);
    await firestore()
      .collection('Listings')
      .where('SellerID', '==', auth().currentUser.uid)
      .orderBy('PostedDate', 'desc')
      .get()
      .then((listingDocs) => {
        listingDocs.forEach((doc) => {
          buildObject(doc);
        });
      });
  }

  async function getPurchaseData() {
    setPurchases([]);
    await firestore()
      .collection('Transactions')
      .where('BuyerID', '==', auth().currentUser.uid)
      .orderBy('Date', 'desc')
      .get()
      .then((purchaseDocs) => {
        purchaseDocs.forEach((doc) => {
          buildPurchase(doc);
        });
      });
  }

  async function buildObject(doc) {
    const reference = await storage().ref(doc.data().ImageURI).getDownloadURL();
    doc.data().photo = {uri: reference};
    setListings((prev) => [...prev, doc.data()]);
  }

  async function buildPurchase(doc) {
    const reference = await storage().ref(doc.data().ImageURI).getDownloadURL();
    doc.data().photo = {uri: reference};
    setPurchases((prev) => [...prev, doc.data()]);
  }

  function showRating(rating) {
    setCurrRating(rating);
    setShow(true);
  }

  async function getData() {
    const reference = await storage()
      .ref('ProfilePicture')
      .child(auth().currentUser.uid + '.JPG')
      .getDownloadURL()
      .catch(() => {
        storage().ref('ProfilePicture').child('Apple.jpg').getDownloadURL();
      });
    setPhoto(reference);

    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then((userDoc) => {
        setUser(userDoc.data());
      });
  }

  if (user === undefined) {
    return null;
  }

  return (
    <View
      style={{
        height: '100%',
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 30,
      }}>
      {Header(
        <View style={{flex: 1}} />,
        <View style={{flex: 5}} />,
        SettingButton(navigation),
      )}
      <CollapsibleHeaderTabView
        tabBarActiveTextColor='#48CA36'
        tabBarUnderlineStyle={{backgroundColor: '#48CA36'}}
        renderScrollHeader={() => (
          <View
            style={{
              flex: 1,
              width: '100%',
              flexDirection: 'row',
              marginBottom: 20,
            }}>
            <View>
              <Image
                source={{uri: photo}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  marginHorizontal: 20,
                }}></Image>
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}>
                {user.Username}
              </Text>
              <Rating
                style={{marginBottom: 10, alignSelf: 'flex-start'}}
                startingValue={user.SellerRating[1]}
                readonly={true}
                imageSize={25}
                ratingCount={5}
              />
              {UserInfoText(require('../assets/Phone.png'), user.Phone)}
            </View>
          </View>
        )}>
        <HFlatList
          index={0}
          tabLabel={'Listings'}
          data={listings}
          renderItem={({item}) => (
            <View
              style={{
                backgroundColor: '#faf9f9',
                margin: 10,
                height: 150,
                borderRadius: 8,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <Text>Listed on {moment(item.PostedDate.toDate(), 'YYYYMMDD').format('ll')}</Text>
                <Text style={{color: 'brown'}} onPress={() => {
                  console.log('edit')
                }}>Edit Post</Text>
              </View>
              <View style={{flex: 3, flexDirection: 'row'}}>
                <View>
                  <Image
                    source={{uri: item.photo.uri}}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      marginHorizontal: 10,
                    }}></Image>
                </View>
                <View>
                  <Text style={{fontWeight: 'bold'}}>{item.Item}</Text>
                  <Text>
                    ${item.Price}
                  </Text>
                  <Text>
                    {item.Description}
                  </Text>
                </View>
              </View>
            </View>
          )}
          style={{width: '100%'}}
        />
        
        <HFlatList
          index={1}
          data={purchases}
          tabLabel={'Purchases'}
          renderItem={({item}) => (
            <View
              style={{
                backgroundColor: '#faf9f9',
                margin: 10,
                height: 150,
                borderRadius: 8,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <Text>Purchased on {moment(item.Date.toDate(), 'YYYYMMDD').format('ll')}</Text>
                <Text style={{color: 'brown'}} onPress={() => {
                  console.log('receipt')
                }}>View Receipt</Text>
              </View>
              <View style={{flex: 3, flexDirection: 'row'}}>
                <View>
                  <Image
                    source={{uri: item.photo.uri}}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      marginHorizontal: 10,
                    }}/>
                </View>
                <View>
                  <Text style={{fontWeight: 'bold'}}>{item.Item} - ${item.Price}</Text>
                  <Text>{item.SellerName}</Text>
                  <Text style={{color: '#F9A528', textDecorationLine: 'underline'}}>Review Seller</Text>
                </View>
              </View>
            </View>
          )}
          style={{width: '100%'}}
        />
      </CollapsibleHeaderTabView>
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
