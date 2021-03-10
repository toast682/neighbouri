import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default function RelatedItemsList({navigation, currentItemId, currentItemTitle}) {
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
          <TouchableOpacity
            onPress={() => navigation.navigate('ListingDetails', item)}
            key={index}
          >
            <View
              style={{
                borderRadius: 8,
                margin: 2
              }}>
              <Image
                source={item.photo}
                style={{width: 90, height: 90, borderRadius: 8}}
              />
              <View style={{padding: 5, alignItems: 'center'}}>
                <Text>{item.Item}</Text>
              </View>
            </View>
          </TouchableOpacity>);
    });

    return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      flexDirection: 'row'
    }}>
      {listItems.length > 0 ? listItems : <Text>No items</Text>}
    </View>
    );
}