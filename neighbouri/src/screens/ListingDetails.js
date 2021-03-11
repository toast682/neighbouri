import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ImageBackground,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import RelatedItemsList from '../components/details/RelatedItemsList';
import {Icon} from 'react-native-elements';
import SellerInfoCard from '../components/details/SellerInfoCard';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/navigation/Header';
import BackButton from '../components/navigation/BackButton';

const usersCollection = firestore().collection('Users');

export default function ListingDetailsScreen({route, navigation}) {
  const item = route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userDocumentId, setUserDocumentId] = useState('');
  const currentUser = auth().currentUser;
  const currentUserId = currentUser.uid;

  useEffect(() => {
    getCurrentUser();
  }, []);

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

  async function addToBookmarks() {
    await usersCollection
      .doc(userDocumentId)
      .update({
        bookmarks: [...userBookmarks, item.ListingID],
      })
      .then(() => {
        setIsBookmarked(true);
      })
      .catch((e) => {
        console.log('There was an error adding bookmark added to user: ', e);
      });
  }

  async function removeFromBookmarks() {
    const rmBookmarks = userBookmarks.filter((b) => b !== item.ListingID);
    await usersCollection
      .doc(userDocumentId)
      .update({
        bookmarks: rmBookmarks,
      })
      .then(() => {
        setIsBookmarked(false);
      })
      .catch((e) => {
        console.log('There was an error removing bookmark from user: ', e);
      });
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <View style={{height: 30}} />
        <Image
          source={item.photo}
          style={{
            width: '100%',
            height: 300,
            resizeMode: 'cover',
            position: 'absolute',
          }}></Image>
        {Header(
          BackButton(navigation),
          <View style={{flex: 5}} />,
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginRight: 20,
              alignSelf: 'center',
            }}>
            <Icon
              name="shopping-cart"
              type="font-awesome"
              color="gold"
              onPress={() => console.log('navigate.navigate to cart page')}
            />
          </View>,
        )}
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 180,
            height: 200,
            width: '100%',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 5,
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'stretch',
              margin: 5,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <View style={{flex: 1, height: 10}} />
            <Text
              style={{
                flex: 4,
                fontSize: 25,
                fontWeight: 'bold',
                color: 'black',
                textAlign: 'center'
              }}>
              {item.Item}
            </Text>
            <View style={{flex: 1}} >
            {isBookmarked ? (
              <Icon
                name="bookmark"
                type="font-awesome"
                color="gold"
                onPress={() => removeFromBookmarks()}
              />
            ) : (
              <Icon
                name="bookmark-o"
                type="font-awesome"
                color="gold"
                onPress={() => addToBookmarks()}
              />
            )}
            </View>
          </View>
          <View
            style={{
              alignSelf: 'stretch',
              margin: 10,
              borderRadius: 8,
              padding: 5,
              backgroundColor: '#f0f0f0',
            }}>
            <Text style={{fontSize: 16}}>{item.Description}</Text>
            <Text style={{fontSize: 16}}>${item.Price}</Text>
          </View>
        </View>

        <View style={{margin: 10, borderRadius: 8}}>
          <Button
            title="Add to Cart"
            onPress={() => {
              console.log('add to cart');
            }}
          />
        </View>
        <View
          style={{
            alignSelf: 'stretch',
            marginLeft: 10,
            marginTop: 10,
          }}>
          <Text style={{fontSize: 16}}>Seller Info</Text>
        </View>
        <SellerInfoCard SellerID={item.SellerID} />
        <View
          style={{
            alignSelf: 'stretch',
            margin: 10,
            borderRadius: 8,
            padding: 5,
          }}>
          <Text style={{fontSize: 16}}>Products related to this item</Text>
          <RelatedItemsList
            currentItemId={item.ListingID}
            currentItemTitle={item.Item}
            navigation={navigation}
          />
        </View>
      </ScrollView>
    </View>
  );
}
