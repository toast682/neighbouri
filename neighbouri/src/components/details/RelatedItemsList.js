import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import BookmarkButton from '../BookmarkButton';
import ItemTile from '../ItemTile';

export default function RelatedItemsList(props) {
    const {navigation, currentItemId, currentItemTitle, userBookmarks, userDocumentId} = props;
    const [relatedItems, setRelatedItems] = useState([]);

    useEffect(() => {
        getData();
    }, [currentItemId]);

    const lowerCaseItem = currentItemTitle.toLowerCase();
    const upperCaseItem = currentItemTitle.toUpperCase();
    const capitalizedFirstLetter = currentItemTitle.charAt(0).toUpperCase() + currentItemTitle.slice(1);

    async function getData() {
        setRelatedItems([]);
        await firestore()
          .collection('Listings')
          .where('Item', 'in', [currentItemTitle, lowerCaseItem, upperCaseItem, capitalizedFirstLetter])
          .get()
          .then((listingDocs) => {
            listingDocs.forEach((doc) => {
              if (doc && doc.data() && doc.data().ListingID !== currentItemId) {
                buildObject(doc);
              }
            });
          })
          .catch((error) => {
            console.log("Caught an error in RelatedItemsList.js: ", error);
        });
      }
    
    async function buildObject(doc) {
      const reference = await storage().ref(doc.data().ImageURI).getDownloadURL();
      doc.data().photo = {uri: reference};
      setRelatedItems((prev) => [...prev, doc.data()]);
    }

    const listItems = relatedItems.map((item, index) => {
      return (
          <ItemTile
            key={index}
            item={item}
            navigation={navigation}
            bookmarks={userBookmarks}
            userDocumentId={userDocumentId}
            />);
    });

    return (
    <SafeAreaView style={{
      alignItems: 'center',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      flexDirection: 'row',
      marginBottom: 45
    }}>
      {listItems.length > 0 ? listItems : <Text>No items</Text>}
    </SafeAreaView>
    );
}