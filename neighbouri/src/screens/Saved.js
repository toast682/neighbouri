import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ItemTile from '../components/ItemTile'
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { useIsFocused } from "@react-navigation/native";

export default function SavedScreen(props) {
  const [listings, setListings] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userDocumentId, setUserDocumentId] = useState('');
  const isFocused = useIsFocused();
  const navigation = props.navigation;

  useEffect(() => {
    setListings([]);
    getCurrentUser();
  }, [props, isFocused]);

  async function getCurrentUser() {
    const currentUser = auth().currentUser;
    const currentUserId = currentUser.uid;
    await firestore()
      .collection('Users')
      .where('uid', '==', currentUserId)
      .get()
      .then((userDocs) => {
        setUserDocumentId(userDocs.docs[0].id);
        const bookmarks =
          userDocs.docs[0].data() && userDocs.docs[0].data().bookmarks;
        setUserBookmarks(bookmarks);
        getData(bookmarks);
      })
      .catch((e) => {
        console.log('There was an error getting user: ', e);
      });
  }

  async function getData(bookmarks) {
    if (bookmarks.length > 0) {
        await firestore()
        .collection('Listings')
        .where('ListingID', 'in', bookmarks)
        .get()
        .then((listingDocs) => {
          listingDocs.forEach((doc) => {
            buildObject(doc);
          });
        });
    }
  }

  async function buildObject(doc) {
    console.log('building')
    const reference = await storage().ref(doc.data().ImageURI).getDownloadURL();
    doc.data().photo = {uri: reference};
    console.log(listings)
    if (!listings.some((item) => item.ListingID === doc.data().ListingID)) {
      setListings((prev) => [...prev, doc.data()]);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{marginHorizontal: '5%'}}
        showsVerticalScrollIndicator={false}
        data={[...new Set(listings)]}
        ListHeaderComponent={
          <View style={{width:'100%'}}>
            <View
              style={{
                flex: 1,
                margin: 10,
                flexDirection: 'row-reverse'
              }}>
              {/* <MessageIconButton navigation={navigation}/> */}
            </View>
            <Text style={{
                color: '#48CA36',
                fontSize: 24,
                alignSelf: 'center', 
                marginBottom: 10
            }}>MY SAVED</Text>
            <View style={{
                borderWidth: 1,
                borderColor:'#E5E5E5',
                width: '100%',
                minWidth: '100%',
                marginBottom: 20
                }}/>
          </View>
        }
        renderItem={({item, index}) => (
          <ItemTile
            item={item}
            key={index}
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: '100%',
    paddingTop: 30
  },
  title: {
    color: '#48CA36',
    fontSize: 24,
    marginTop: 70,
    alignSelf: 'flex-start', 
    marginBottom: 10
  }
});
