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
import {HPageViewHoc} from 'react-native-head-tab-view';
import {CollapsibleHeaderTabView} from 'react-native-scrollable-tab-view-collapsible-header';
import Header from '../components/navigation/Header';
import SettingButton from '../components/SettingButton';
import UserInfoText from '../components/profile/UserInfoText';
import {Rating, AirbnbRating} from 'react-native-ratings';
import moment from 'moment'

export default function ProfileScreen({navigation}) {
  const HFlatList = HPageViewHoc(FlatList);

  const [photo, setPhoto] = useState();
  const [user, setUser] = useState();
  const [show, setShow] = useState(false);
  const [listings, setListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sellerRating, setSellerRating] = useState(0);
  const [sellerNumberOfRatings, setSellerNumberOfRatings] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [documentId, setDocumentId] = useState('');

  useEffect(() => {
    getData();
    getListingData();
    getPurchaseData();
  }, []);

   async function updateRating() {
     await firestore()
       .collection('Users')
       .doc(documentId)
       .update({
          SellerRating:[sellerNumberOfRatings+1,(sellerRating*sellerNumberOfRatings+newRating)/(sellerNumberOfRatings+1)]
       })
       .catch((e) => {
          console.log(e);
       });
   }

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
        setDocumentId(userDoc.id);
        setSellerRating(user.SellerRating[1]);
        setSellerNumberOfRatings(user.SellerRating[0]);
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
        makeHeaderHeight={() => 120}
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
          data={[...new Set(listings)]}
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
          keyExtractor={(name) => name}
        />
        <HFlatList
          index={1}
          data={[...new Set(purchases)]}
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
                  <TouchableOpacity onPress={() => {setShow(true)}}>
                  <Text style={{color: '#F9A528', textDecorationLine: 'underline'}}>Review Seller</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          style={{width: '100%'}}
          keyExtractor={(name) => name}
        />
      </CollapsibleHeaderTabView>

       <Modal transparent={true} visible={show}>
           <View style={styles.modalOuterContainer}>
              <View style={styles.modalInnerContainer}>
                 <Text style={styles.title}> Rate the seller </Text>
                 <AirbnbRating showRating
                    readonly={false}
                    onFinishRating={setNewRating}
                    reviews={["Terrible", "Bad", "OK", "Good","Amazing"]}
                    imageSize={40}/>
                 <View style={{ flexDirection:"row" }}>
                    <TouchableOpacity style={styles.modalButton} onPress={()=>{setShow(false);}}>
                       <Text style={styles.buttonText}>{"CLOSE"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={()=>{
                       setShow(false);
                       updateRating();
                      }}>
                        <Text style={styles.buttonText}>{"SUBMIT"}</Text>
                    </TouchableOpacity>
                 </View>
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
    justifyContent: 'center',
    margin: 50,
    marginTop: 240,
    marginBottom: 240,
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },

  button: {
    color: '#3dafe0',
    margin: 50,
  },

  modalButton: {
    backgroundColor: "#48CA36",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 7,
    margin:30,
    fontSize: 20,
  },

  buttonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
  },

  input: {
    margin: 10,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    width: 200,
  },
});
