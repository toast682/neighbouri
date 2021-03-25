import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function Checkout({route, navigation}) {
  const {item, currentUserId} = route.params;

  //   useEffect(() => {
  //     getCurrentUser();
  //   }, []);

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
        if (bookmarks.includes(item.ListingID)) {
          setIsBookmarked(true);
        }
      })
      .catch((e) => {
        console.log('There was an error getting user: ', e);
      });
  }

  return (
    <View>
      <Text style={{fontSize: 16}}>{item.Description}</Text>
      <Text style={{fontSize: 16}}>${item.Price}</Text>
      <Text>{JSON.stringify(item)}</Text>
      <Text>{currentUserId}</Text>
      <Button
        title="Pay for Order"
        onPress={() => {
          navigation.navigate('CardFormScreen', {
            item: item,
            currentUserId: currentUserId,
            navigation,
          });
        }}></Button>
    </View>
  );
}
