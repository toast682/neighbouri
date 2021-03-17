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
          <View
            key={index}
            style={{
                borderRadius: 15,
                margin: 2,
                backgroundColor: '#FAF9F9'
              }}
          > 
            <ImageBackground 
                source={item.photo}
                style={{
                  width: 150,
                  height: 150,
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end'
                }}
                imageStyle={{
                  borderRadius: 15
                }}
              ><View style={{margin: 5}}>
                <BookmarkButton itemID={item.ListingID} />
              </View>
            </ImageBackground>
            <TouchableOpacity
              style={{padding: 5, alignItems: 'center', flexDirection: 'row'}}
              onPress={() => navigation.navigate('ListingDetails', item)}
            >
              <Text>${item.Price} </Text>
              <Text>{item.Item}</Text>
            </TouchableOpacity>
          </View>);
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